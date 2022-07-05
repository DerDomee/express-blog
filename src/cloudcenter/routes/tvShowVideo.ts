import {NextFunction, Request, Response} from 'express';
import TvEpisode from '../../database/dbmodels/tvepisode.model';
import {Route} from '../../mean/types';

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
	});
	if (!episode) {
		res.redirect(`/tv/${req.params.showId}/?s=${req.params.seasonId}`);
	}
	res.locals.htmlTitle = `${episode.name} - Dominik Riedig`;
	res.locals.backlink = `/tv/${req.params.showId}/?s=${req.params.seasonId}`;
	res.locals.videoname = `${req.params.episodeId}.mp4`;
	res.render('videoViewer', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/watch/:showId/:seasonId/:episodeId',
	get: get,
} as Route;
