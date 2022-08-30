import {NextFunction, Request, Response} from 'express';
import TvEpisode from '../../database/dbmodels/tvepisode.model';
import TvSeason from '../../database/dbmodels/tvseason.model';
import TvShow from '../../database/dbmodels/tvshow.model';
import {Route} from '../../mean/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	const showSeason = req.query.s ?? false;
	const currentShow = await TvShow.findOne({
		where: {
			tvShowId: req.params.showId,
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

	let currentSeason = currentShow.seasons.find((season) => {
		return season.seasonId == showSeason;
	});
	if (!currentSeason) {
		currentSeason = currentShow.seasons.find((season) => {
			return season.seasonNumberInShow = 1;
		});
	}
	if (!currentSeason && currentShow.seasons.length >= 1) {
		currentSeason = currentShow.seasons[0];
	}

	const videoLengths: Promise<number>[] = [];
	currentSeason.episodes.forEach((episode) => {
		videoLengths.push(episode.getVideoLength());
	});
	const actualLengths = (await Promise.allSettled(videoLengths)).map(
		(promise) => (promise as PromiseFulfilledResult<number>).value);

	currentSeason.episodes.map((episode) => {
		episode.videoLength = actualLengths[
			currentSeason.episodes.indexOf(episode)];
	});

	res.locals.pageTitle = `${currentShow.name}`;
	res.locals.htmlTitle = `${currentShow.name} - Cloudcenter - Dominik Riedig`;
	res.locals.currentShow = currentShow;
	res.locals.currentSeason = currentSeason;
	res.render('tvShowView', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/tv/:showId',
	get: get,
} as Route;
