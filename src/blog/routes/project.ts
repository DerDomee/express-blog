import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	const projecturl = req.params.projecturl;
	res.locals.pageTitle = `"${projecturl}" Projectview`;
	res.locals.htmlTitle = `${projecturl} - Dominik Riedig`;
	res.render('project', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/p/:projecturl',
	get: get,
} as Route;
