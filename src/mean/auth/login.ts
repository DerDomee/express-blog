import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {User} from '../../database/dbmodels/user.model';
import {LoginSession} from '../../database/dbmodels/loginsession.model';
import logger from '../../logger';

export default {

	get: (req: Request, res: Response, _next: NextFunction) => {
		if (res.locals.auth.isAuthed) {
			res.redirect('/');
			return;
		}
		res.locals.wrongCredentials = false;
		res.render('login', {...req.app.locals, ...res.locals});
	},

	post: async (req: Request, res: Response, _next: NextFunction) => {
		if (res.locals.auth.isAuthed) {
			res.redirect('/');
			return;
		}

		const username = req.body.username;
		const password = req.body.password;
		const persistent = req.body.isPersistent;

		res.locals.wrongCredentials = false;

		let authed = false;

		const user = await User.findOne({where: {
			user_username: username,
		}});

		if (await bcrypt.compare(password, user?.user_password_hash ?? '')) {
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
				session_created_datetime: Date.now(),
				session_is_persistent: persistent ? true : false,
				session_lastused_datetime: Date.now(),
				session_expires_datetime: persistent ? Date.now() +
					(1000 * 60 * 60 * 12) : Date.now() + (1000 * 60 * 60 * 24 * 30),
				session_original_useragent: req.useragent.source,
				session_current_useragent: req.useragent.source,
				session_original_ip: req.ip,
				session_current_ip: req.ip,
				UserUserId: user.user_id,
			});
		} catch (err) {
			logger.verbose(err);
			logger.verbose(err.stack);
		}
		if (loginSession === null) {
			res.status(500).render('login', {...req.app.locals, ...res.locals});
			res.end();
			return;
		}

		console.dir(loginSession);

		res.cookie('dd_user_sess_id', loginSession.session_cookie, {
			expires: loginSession.session_expires_datetime,
			secure: true,
			httpOnly: true,
		});
		res.redirect('/');
		return;
	},

};
