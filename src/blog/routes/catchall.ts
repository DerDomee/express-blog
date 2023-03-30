import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	res.render('404', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '*',
	get: get,
} as Route;
