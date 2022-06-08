import {NextFunction, Request, Response} from 'express';
import User from '../database/dbmodels/user.model';
import LoginSession from '../database/dbmodels/loginsession.model';

export default async (req: Request, res: Response, next: NextFunction) => {
	const sessionCookie = req.cookies.dd_user_sess_id;
	res.locals.auth = {
		isAuthed: false,
		authedUser: null,
	};
	if (!sessionCookie) {
		next();
		return;
	}

	const loginSession = (await LoginSession.findOne({
		where: {
			session_cookie: sessionCookie,
		},
		include: User,
	}));
	if (loginSession === null) {
		res.clearCookie('dd_user_sess_id');
		next();
		return;
	}

	if (loginSession.session_expires_datetime < new Date()) {
		res.clearCookie('dd_user_sess_id');
		await loginSession.destroy();
	}
	res.locals.auth.isAuthed = true;
	res.locals.auth.authedUser = await loginSession.$get('session_user');
	next();
	await loginSession.update({
		session_lastused_datetime: new Date(),
		session_expires_datetime: loginSession.session_is_persistent ? Date.now() +
					(1000 * 60 * 60 * 12) : Date.now() + (1000 * 60 * 60 * 24 * 30),
	});
};
