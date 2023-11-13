import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';
import TvShow from '../../database/dbmodels/tvshow.model';
import TvSeason from '../../database/dbmodels/tvseason.model';
import TvEpisode from '../../database/dbmodels/tvepisode.model';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Your user permissions /tvshows';
	res.locals.htmlTitle = 'Permissions - Dominik Riedig - Blog und Projekte';
	res.locals.currentShow = await TvShow.findOne({
		where: {
			tvShowId: req.params.currentShowId,
		},
		include: [
			{
				model: TvSeason,
				include: [
					{
						model: TvEpisode,
					},
				],
			},
		],
		order: [
			['seasons', 'seasonNumberInShow', 'ASC'],
			['seasons', 'episodes', 'episodeNumberInSeason', 'ASC'],
		],
	});
	res.render('tvshow_editshow', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const tvSeasonNameField = req.body['newseason-name'];
	const tvSeasonNumberField = +req.body['newseason-number'];

	if (!tvSeasonNameField) {
		return res.redirect(`/tvshows/${req.params.currentShowId}?error=noname`);
	}
	if (tvSeasonNumberField?.toString() === 'NaN') {
		return res.redirect(`/tvshows/${req.params.currentShowId}?error=nonumber`);
	}

	await TvSeason.create({
		name: tvSeasonNameField,
		seasonNumberInShow: tvSeasonNumberField,
		tvShowId: req.params.currentShowId,
	});

	res.redirect(`/tvshows/${req.params.currentShowId}`);
}

export default {
	routeMatcher: '/tvshows/:currentShowId',
	get: get,
	post: post,
} as Route;
