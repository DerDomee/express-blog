import {NextFunction, Request, Response} from 'express';
import {Route} from '../../mean/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Home Page /';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('home', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/',
	get: get,
} as Route;
