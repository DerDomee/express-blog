import {NextFunction, Request, Response} from 'express';
import LoginSession from '../../database/dbmodels/loginsession.model';
import Group from '../../database/dbmodels/group.model';
import User from '../../database/dbmodels/user.model';
import {Route} from '../../mean/types';
import Permission from '../../database/dbmodels/permission.model';

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
	res.json({});
}

export default {
	routeMatcher: '/userctl',
	get: get,
	post: post,
} as Route;
