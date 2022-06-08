import {NextFunction, Request, Response} from 'express';
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
	const articleurl = req.params.articleurl;
	const article = await BlogArticle.findOne({
		where: {
			article_url_id: articleurl,
		},
		include: Revision,
	});
	res.locals.article = article;
	try {
		res.locals.revision = JSON.parse(
			article.article_current_revision.revision_content);
		res.locals.metaDescription = res.locals.revision.blurb;
	} catch (err) {
		res.status(404);
		res.render('404', {...req.app.locals, ...res.locals});
		return;
	}
	res.locals.pageTitle = res.locals.revision.title;
	res.locals.htmlTitle = `${res.locals.revision.htmlTitle} - Dominik Riedig`;
	res.render('article', {...req.app.locals, ...res.locals});
}

export default {
	routeMatcher: '/a/:articleurl',
	get: get,
} as Route;
