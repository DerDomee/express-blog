import {NextFunction, Request, Response} from 'express';
import BlogArticleRevision from
	'../../database/dbmodels/blogarticlerevision.model';
import BlogArticle from '../../database/dbmodels/blogarticle.model';
import {Route} from '../../mean/types';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	const articleId: string = req.params.articleid;
	const article = await BlogArticle.findOne({
		where: {
			article_id: articleId,
		},
		include: [
			{
				model: BlogArticleRevision,
			},
		],
	});
	const articleContent = JSON.parse(article.current_revision.content);
	if (!article) res.redirect(307, '/articles');
	res.locals.article = article;
	res.locals.articleContent = articleContent;
	res.locals.creationType = 'edit';
	res.locals.pageTitle = 'Blog bearbeiten /blogedit';
	res.locals.htmlTitle = 'Neues Blog - CMS - Dominik Riedig';
	res.render('editarticle', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	res.status(501).json({status: 501, reason: 'Not implemented yet!'}).end();
}

export default {
	routeMatcher: '/articles/edit/:articleid',
	get: get,
	post: post,
} as Route;
