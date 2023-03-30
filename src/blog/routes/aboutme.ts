import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'About me /aboutme';
	res.locals.htmlTitle = 'Über mich - Dominik Riedig';
	res.render('aboutme', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/aboutme',
	get: get,
} as Route;
