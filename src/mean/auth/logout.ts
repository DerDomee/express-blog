import {NextFunction, Request, Response} from 'express';
import {LoginSession} from '../../database/dbmodels/loginsession.model';
import {User} from '../../database/dbmodels/user.model';

export default {

	get: async (req: Request, res: Response, _next: NextFunction) => {
		const sessionCookie = req.cookies.dd_user_sess_id;
		res.clearCookie('dd_user_sess_id');
		const loginSession = await LoginSession.findOne({
			where: {
				session_cookie: sessionCookie,
			},
			include: User,
		});
		if (loginSession !== null) {
			await loginSession.destroy();
		}
		res.redirect('/');
		return;
	},

};
