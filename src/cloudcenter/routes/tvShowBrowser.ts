import {NextFunction, Request, Response} from 'express';
import TvShow from '../../database/dbmodels/tvshow.model';
import {Route} from '../../mean/types';
import app from '../cloudcenter';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	app.locals.allTvShows = await TvShow.findAll();
	res.locals.pageTitle = 'Serienbrowser';
	res.locals.htmlTitle = 'Serien - Cloudcenter - Dominik Riedig';
	res.render('tvShowBrowser', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/tv',
	get: get,
} as Route;
