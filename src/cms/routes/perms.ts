import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Your user permissions /perms';
	res.locals.htmlTitle = 'Permissions - Dominik Riedig - Blog und Projekte';
	const perms = await res.locals.auth.authedUser.getCumulatedPermissions();
	const groups = await res.locals.auth.authedUser.getUserGroups();
	res.locals.auth.permissions = perms;
	res.locals.auth.groups = groups;
	res.locals.auth.gp = {};
	for (const group of groups) {
		res.locals.auth.gp[`${group.name}`] = await group.getGroupPermissions();
	}
	res.render('perms', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/permctl',
	get: get,
} as Route;
