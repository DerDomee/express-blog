import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {Route} from '../types';
import User from '../../database/dbmodels/user.model';
import LoginSession from '../../database/dbmodels/loginsession.model';
import logger from '../logger';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	if (res.locals.auth.isAuthed) {
		res.redirect('/');
		return;
	}
	res.locals.wrongCredentials = false;
	res.render('login', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	if (res.locals.auth.isAuthed) {
		res.redirect('/');
		return;
	}

	const username = req.body.username;
	const password = req.body.password;
	const persistent = req.body.isPersistent;

	res.locals.wrongCredentials = false;

	let authed = false;
	const user = await User.findOne({
		where: {
			username: username,
		},
	});

	if (await bcrypt.compare(password, user?.password_hash ?? '')) {
		authed = true;
	}

	if (!authed) {
		res.locals.wrongCredentials = true;
		res.status(401).render('login', {...req.app.locals, ...res.locals});
		res.end();
		return;
	}

	let loginSession = null;
	try {
		loginSession = await LoginSession.create({
			session_cookie: crypto.randomBytes(128).toString('hex'),
			created_datetime: Date.now(),
			is_persistent: persistent ? true : false,
			lastused_datetime: Date.now(),
			expires_datetime: persistent ? Date.now() +
					(1000 * 60 * 60 * 12) : Date.now() + (1000 * 60 * 60 * 24 * 30),
			original_useragent: req.useragent.source,
			current_useragent: req.useragent.source,
			original_ip: req.ip,
			current_ip: req.ip,
			user_id: user.user_id,
		});
	 } catch (err) {
		logger.warn('Login: Session creation failed.');
		logger.warn(err);
		logger.warn(err.stack);
	}

	if (loginSession === null) {
		res.status(500).render('login', {...req.app.locals, ...res.locals});
		res.end();
		return;
	}

	res.cookie('dd_user_sess_id', loginSession.session_cookie, {
		expires: loginSession.expires_datetime,
		secure: true,
		httpOnly: true,
	});
	res.redirect('/');
	return;
}

export default {
	routeMatcher: '/login',
	get: get,
	post: post,
} as Route;
