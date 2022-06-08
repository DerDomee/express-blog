import {NextFunction, Request, Response} from 'express';
import crypto from 'crypto';
import {Route} from '../../mean/types';
import Revision from '../../database/dbmodels/revision.model';
import BlogArticle from '../../database/dbmodels/blogarticle.model';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	res.locals.pageTitle = 'Neues Blog /blogedit';
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
	if (req.body.blogeditPagetitle === '' || req.body.blogeditHtmltitle === '' ||
	    req.body.blogeditBlurb === '' || req.body.blogeditContent === '' ||
	    req.body.blogeditUrlId === '') {
		res.redirect('/articles?failure');
		return;
	}
	const revision = await Revision.create({
		revision_id: crypto.pseudoRandomBytes(16).toString('hex'),
		revision_content: JSON.stringify({
			title: req.body.blogeditPagetitle,
			htmlTitle: req.body.blogeditHtmlTitle,
			blurb: req.body.blogeditBlurb,
			content: req.body.blogeditContent,
		}),
	});
	await BlogArticle.create({
		article_url_id: req.body.blogeditUrlId,
		article_original_publication_time: Date.now(),
		article_current_revision_id: revision.revision_id,
		article_last_update_time: Date.now(),
		article_is_published: req.body.blogeditPublishUnlisted ? false : true,
	});
	res.redirect('/articles?success');
}

export default {
	routeMatcher: '/articles/new',
	get: get,
	post: post,
} as Route;
