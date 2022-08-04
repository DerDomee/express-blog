import {NextFunction, Request, Response} from 'express';
import {Route} from '../../mean/types';

/**
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Imagecontrol /imagectl';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('imagectl', {...req.app.locals, ...res.locals});
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
	routeMatcher: '/imagectl',
	get: get,
	post: post,
} as Route;
