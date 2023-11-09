import {NextFunction, Request, Response} from 'express';
import LoginSession from '../../database/dbmodels/loginsession.model';
import Group from '../../database/dbmodels/group.model';
import crypto from 'crypto';
import options from '../../options';
import bcrypt from 'bcrypt';
import User from '../../database/dbmodels/user.model';
import {Route} from '../../shared/types';
import Permission from '../../database/dbmodels/permission.model';
import {sendMail} from '../../shared/nodemailer';

/**
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.allUsers = await User.findAll({
		include: [
			Group,
			LoginSession,
			Permission,
		],
	});
	res.locals.pageTitle = 'Usercontrol /userctl';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('userctl', {...req.app.locals, ...res.locals});
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const newPassword = crypto.randomBytes(16).toString('base64url');
	const newEmail = req.body['newuser-email'];
	let newUser = null;
	try {
		newUser = await User.create({
			email: newEmail,
			disabled: false,
			creation_time: Date.now(),
			password_hash: await bcrypt.hash(newPassword, 15),
		});
	} catch (err) {
		return res.json({error: 'User creation failed.'});
	}

	if (newUser === null) {
		return res.json({error: 'User creation failed.'});
	}

	const fqdn = `${req.protocol}://${req.hostname}${
		(req.socket.localPort === 80 || req.socket.localPort === 443) ?
			`` :
			`:${req.socket.localPort}`}`;

	await sendMail({
		to: newUser.email,
		subject: 'A new user account has been created for you.',
		text: `Hello ${newUser.email}},

a new user account has been created for you on
${fqdn}.

You can access it now by logging in with your email address and the following
temporary password:

${newPassword}

After your first login you will be asked to change your password.
You can setup your username and other profile options afterwards
in the user control panel.

If you think this is a mistake, you can simply ignore this email. If no login
attempt is made in the next 48 hours, the account will be deleted automatically.
If you got this email multiple times and you don't know why, please contact
the administrator under following email:

${options.mailAdminAddress}

--------------------------------------------
This is an automated message. Please do not reply.
--------------------------------------------


This email has been sent to you because you have an account on
${fqdn}. If you think this is a mistake, please
contact the administrator under following email:
${options.mailAdminAddress}
This is not a newsletter. You will not receive any further emails from this
address unless a user action for your account is currently in progress.
`,
	});
	res.locals.allUsers = await User.findAll({
		include: [
			Group,
			LoginSession,
			Permission,
		],
	});
	res.redirect('.');
}

export default {
	routeMatcher: '/userctl',
	get: get,
	post: post,
} as Route;
