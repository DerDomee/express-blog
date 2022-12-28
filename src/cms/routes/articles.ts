import {NextFunction, Request, Response} from 'express';
import {Route} from '../../mean/types';
import BlogArticle from '../../database/dbmodels/blogarticle.model';
import BlogArticleRevision from
	'../../database/dbmodels/blogarticlerevision.model';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Artikelliste /articles';
	res.locals.htmlTitle = 'Artikelliste - CMS - Dominik Riedig';
	res.locals.allArticles = [] as BlogArticle[];
	(
		await BlogArticle.findAll({
			order: [['article_id', 'DESC']],
			include: [BlogArticleRevision],
		})
	).forEach((article) => {
		try {
			article.current_revision.content = JSON.parse(
				article.current_revision.content);
			res.locals.allArticles.push(article);
		} catch (err) {}
	});
	res.render('articles', {...req.app.locals, ...res.locals});
}

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	const blogid = parseInt(req.body.blogId);
	const blogArticle = await BlogArticle.findOne({
		where: {
			article_id: blogid,
		},
	});

	if (!req.body.blogMethod || Number.isNaN(blogid) || blogArticle === null) {
		res.redirect('/articles?failure');
		return;
	}
	switch (req.body.blogMethod) {
	case 'publish':
		await blogArticle.update({
			is_published: true,
		});
		res.redirect('/articles?success');
		break;
	case 'unpublish':
		await blogArticle.update({
			is_published: false,
		});
		res.redirect('/articles?success');
		break;
	case 'delete':
		await blogArticle.destroy();
		res.redirect('/articles?success');
		break;
	default:
		res.redirect('/articles?failure');
	}
}

export default {
	routeMatcher: '/articles',
	get: get,
	post: post,
} as Route;
