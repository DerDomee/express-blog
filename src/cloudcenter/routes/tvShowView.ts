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
	const currentShow = await TvShow.findOne({
		where: {
			tvShowId: req.params.showId,
		},
		include: [
			{
				model: TvSeason,
				order: [
					['seasonNumberInShow', 'ASC'],
				],
				include: [
					{
						model: TvEpisode,
						order: [
							['episodeNumberInSeason', 'ASC'],
						],
					},
				],
			},
		],
	});

	const allSeasons = [] as any;

	currentShow.seasons.forEach((season) => {
		allSeasons.push({
			seasonId: season.seasonId,
			seasonNumberInShow: season.seasonNumberInShow,
			name: season.name,
			episodes: [],
		});

		season.episodes.forEach((episode) => {
			allSeasons.find(
				(thisSeason: any) => thisSeason.seasonId == season.seasonId,
			).episodes.push({
				episodeId: episode.episodeId,
				episodeNumberInSeason: episode.episodeNumberInSeason,
				name: episode.name,
				slug: episode.slug,
				firstAired: episode.firstAired,
			});
		});
	});

	res.locals.pageTitle = `${currentShow.name}`;
	res.locals.htmlTitle = `${currentShow.name} - Cloudcenter - Dominik Riedig`;
	res.locals.tvShowData = allSeasons;
	res.render('tvShowView', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/tv/:showId',
	get: get,
} as Route;
