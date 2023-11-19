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
	res.locals.currentEpisode = await TvEpisode.findOne({
		where: {
			episodeId: req.params.currentEpisodeId,
		},
		include: [
			{
				model: TvSeason,
			},
			{
				model: TvShow,
			},
		],
		order: [
			['episodeNumberInSeason', 'ASC'],
		],
	});
	res.locals.pageTitle = `Episode bearbeiten: ${
		res.locals.currentEpisode.name} - ${
		res.locals.currentEpisode.tvSeason.name} - ${
		res.locals.currentEpisode.tvShow.name}`;
	res.locals.htmlTitle = `Episode bearbeiten - ${
		res.locals.currentEpisode.name} - ${
		res.locals.currentEpisode.tvSeason.name} - ${
		res.locals.currentEpisode.tvShow.name}`;
	res.render('tvshow_editepisode', {...req.app.locals, ...res.locals});
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

	const showId = req.params.currentShowId;
	const seasonId = req.params.currentSeasonId;
	const episodeId = req.params.currentEpisodeId;

	if (!tvEpisodeNameField) {
		return res.redirect(`/tvshows/${
			showId}/${
			seasonId}?error=noname`,
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
	routeMatcher: '/tvshows/:currentShowId/:currentSeasonId/:currentEpisodeId',
	get: get,
	post: post,
} as Route;
