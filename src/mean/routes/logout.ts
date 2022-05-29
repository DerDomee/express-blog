import {NextFunction, Request, Response} from 'express';
import {Route} from '../types';
import {User} from '../../database/dbmodels/user.model';
import {LoginSession} from '../../database/dbmodels/loginsession.model';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	const sessionCookie = req.cookies.dd_user_sess_id;
	res.clearCookie('dd_user_sess_id').redirect('/');
	const loginSession = await LoginSession.findOne({
		where: {
			session_cookie: sessionCookie,
		},
		include: User,
	});
	if (loginSession !== null) {
		await loginSession.destroy();
	}
	return;
}

export default {
	routeMatcher: '/logout',
	get: get,
} as Route;
