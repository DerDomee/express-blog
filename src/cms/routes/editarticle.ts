import {NextFunction, Request, Response} from 'express';
import {Route} from '../../mean/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Blog bearbeiten /blogedit';
	res.locals.htmlTitle = 'Neues Blog - CMS - Dominik Riedig';
	res.render('editarticle', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	res.status(501).json({}).end();
}

export default {
	routeMatcher: '/articles/new',
	get: get,
	post: post,
} as Route;
