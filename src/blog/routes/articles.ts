import {NextFunction, Request, Response} from 'express';
import {Op} from 'sequelize';

import Revision from '../../database/dbmodels/revision.model';
import BlogArticle from '../../database/dbmodels/blogarticle.model';
import {Route} from '../../mean/types';

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
			order: [['article_original_publication_time', 'DESC']],
			where: {
				article_is_published: true,
				article_original_publication_time: {
					[Op.lte]: Date.now(),
				},
			},
			include: Revision,
		})
	).forEach((element) => {
		try {
			element.article_current_revision.revision_content = JSON.parse(
				element.article_current_revision.revision_content);
			res.locals.allArticles.push(element);
		} catch (err) {}
	});

	res.render('articlebrowser', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/articles',
	get: get,
} as Route;
