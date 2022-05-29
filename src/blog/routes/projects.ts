import {NextFunction, Request, Response} from 'express';
import {Route} from '../../mean/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Meine Projekte';
	res.locals.htmlTitle = 'Projekte - Dominik Riedig';
	res.render('projectbrowser', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/projects',
	get: get,
} as Route;
