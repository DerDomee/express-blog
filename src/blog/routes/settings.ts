import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Website-Einstellungen';
	res.locals.htmlTitle = 'Einstellungen - Dominik Riedig';
	res.render('settings', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/settings',
	get: get,
} as Route;
