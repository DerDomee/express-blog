import {NextFunction, Request, Response} from 'express';
import TvEpisode from '../../database/dbmodels/tvepisode.model';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	const episode = await TvEpisode.findOne({
		where: {
			episodeId: req.params.episodeId,
		},
		include: [{
			all: true,
			nested: true,
		}],
	});
	if (!episode) {
		res.redirect(`/tv/${req.params.showId}/?s=${req.params.seasonId}`);
	}
	res.locals.htmlTitle = `${episode.name} - Dominik Riedig`;
	res.locals.backlink = `/tv/${req.params.showId}/?s=${req.params.seasonId}`;
	res.locals.videoname = `${req.params.episodeId}.mp4`;
	res.locals.episodename = episode.name;
	res.locals.nextEpisode = episode.nextEpisode;
	res.render('videoViewer', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const episode = await TvEpisode.findOne({
		where: {
			episodeId: req.params.episodeId,
		},
		include: [{
			all: true,
			nested: true,
		}],
	});
	res.json(JSON.stringify(episode.nextEpisode));
}

export default {
	routeMatcher: '/watch/:showId/:seasonId/:episodeId',
	get: get,
	post: post,
} as Route;
