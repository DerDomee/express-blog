import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';
import TvShow from '../../database/dbmodels/tvshow.model';
import TvSeason from '../../database/dbmodels/tvseason.model';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Your user permissions /tvshows';
	res.locals.htmlTitle = 'Permissions - Dominik Riedig - Blog und Projekte';
	res.locals.currentShows = await TvShow.findAll({
		include: [
			{
				model: TvSeason,
			},
		],
	});
	res.render('tvshow_main', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const tvShowNameField = req.body['newshow-name'];
	const tvStartDateField = req.body['newshow-startdate'];

	if (!tvShowNameField) {
		res.redirect('/tvshows?error=noname');
	}
	if (!tvStartDateField) {
		res.redirect('/tvshows?error=nodate');
	}
	const tvStartDate = new Date(tvStartDateField);

	if (!tvStartDate) {
		res.redirect('/tvshows?error?invaliddate');
	}

	await TvShow.create({
		name: tvShowNameField,
		first_produced: tvStartDate,
	});

	res.redirect('/tvshows');
}

export default {
	routeMatcher: '/tvshows',
	get: get,
	post: post,
} as Route;
