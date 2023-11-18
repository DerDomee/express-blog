import {NextFunction, Request, Response} from 'express';
import {Route} from '../../shared/types';
import TvShow from '../../database/dbmodels/tvshow.model';
import TvSeason from '../../database/dbmodels/tvseason.model';
import TvEpisode from '../../database/dbmodels/tvepisode.model';
import logger from '../../shared/logger';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Your user permissions /tvshows';
	res.locals.htmlTitle = 'Permissions - Dominik Riedig - Blog und Projekte';
	res.locals.currentSeason = await TvSeason.findOne({
		where: {
			seasonId: req.params.currentSeasonId,
		},
		include: [
			{
				model: TvEpisode,
			},
			{
				model: TvShow,
			},
		],
		order: [
			['episodes', 'episodeNumberInSeason', 'ASC'],
		],
	});
	res.locals.currentShow;
	res.render('tvshow_editseason', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const tvEpisodeNameField = req.body['newepisode-name'];
	const tvEpisodeNumberField = +req.body['newepisode-number'];

	if (!tvEpisodeNameField) {
		return res.redirect(`/tvshows/${
			req.params.currentShowId}/${
			req.params.currentSeasonId}?error=noname`,
		);
	}
	if (tvEpisodeNumberField?.toString() === 'NaN') {
		return res.redirect(`/tvshows/${
			req.params.currentShowId}/${
			req.params.currentSeasonId}?error=nonumber`,
		);
	}
	await TvEpisode.create({
		name: tvEpisodeNameField,
		episodeNumberInSeason: tvEpisodeNumberField,
		tvShowId: req.params.currentShowId,
		tvSeasonId: req.params.currentSeasonId,
	});

	res.redirect(`/tvshows/${
		req.params.currentShowId}/${
		req.params.currentSeasonId}`);
}

export default {
	routeMatcher: '/tvshows/:currentShowId/:currentSeasonId',
	get: get,
	post: post,
} as Route;
