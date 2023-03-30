import {NextFunction, Request, Response} from 'express';
import {Op} from 'sequelize';

import BlogArticleRevision from
	'../../database/dbmodels/blogarticlerevision.model';
import BlogArticle from '../../database/dbmodels/blogarticle.model';
import {Route} from '../../shared/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Artikelbrowser';
	res.locals.htmlTitle = 'Blog - Dominik Riedig';
	res.locals.allArticles = [] as BlogArticle[];
	(
		await BlogArticle.findAll({
			order: [['original_publication_time', 'DESC']],
			where: {
				is_published: true,
				original_publication_time: {
					[Op.lte]: Date.now(),
				},
			},
			include: BlogArticleRevision,
		})
	).forEach((element) => {
		try {
			element.current_revision.content = JSON.parse(
				element.current_revision.content);
			res.locals.allArticles.push(element);
		} catch (err) {}
	});

	res.render('articlebrowser', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/articles',
	get: get,
} as Route;
