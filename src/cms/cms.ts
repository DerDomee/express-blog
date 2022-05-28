import path from 'path';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';
import dynamicImage from '../mean/dynamicImage';
import checkauth from '../mean/auth/checkauth';
import moment from 'moment';
import {Revision} from '../database/dbmodels/revision.model';
import {BlogArticle} from '../database/dbmodels/blogarticle.model';

const app = express();

app.locals.navigation = navigation;
app.locals.currentyear = new Date().getUTCFullYear();
app.locals.moment = moment;
app.locals.showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create nonce for helmet CSP script-src using nonce
app.use((_req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
	next();
});

app.use(helmet);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(useragent.express());
app.use(checkauth);
app.use(heroicon);

app.use(express.static('./dist/cms/public'));

app.use((_req, res, next) => {
	const returnPath = app.get('blogAbsPath');
	if (!res.locals.auth.isAuthed) {
		res.redirect(`${returnPath}/login`);
		return;
	}
	next();
});

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = 'CMS /';
	res.locals.htmlTitle = 'Dominik Riedig - CMS';
	res.render('home', {...app.locals, ...res.locals});
});

app.get('/articles', async (_req, res) => {
	res.locals.pageTitle = 'Artikelliste /articles';
	res.locals.htmlTitle = 'Artikelliste - CMS - Dominik Riedig';
	res.locals.allArticles = [] as BlogArticle[];
	(
		await BlogArticle.findAll({
			order: [['article_id', 'DESC']],
			include: Revision,
		})
	).forEach((element) => {
		try {
			element.Revision.revision_content = JSON.parse(
				element.Revision.revision_content);
			res.locals.allArticles.push(element);
		} catch (err) {}
	});
	res.render('articles', {...app.locals, ...res.locals});
});

app.post('/articles', async (req, res) => {
	const blogid = parseInt(req.body.blogId);
	const blogArticle = await BlogArticle.findOne({
		where: {
			article_id: blogid,
		},
	});

	if (!req.body.blogMethod || blogid === NaN || blogArticle === null) {
		res.redirect('/articles?failure');
		return;
	}
	switch (req.body.blogMethod) {
	case 'publish':
		await blogArticle.update({
			article_is_published: true,
		});
		res.redirect('/articles?success');
		break;
	case 'unpublish':
		await blogArticle.update({
			article_is_published: false,
		});
		res.redirect('/articles?success');
		break;
	default:
		res.redirect('/articles?failure');
	}
});

app.get('/articles/new', (_req, res) => {
	res.locals.pageTitle = 'Neues Blog /blogedit';
	res.locals.htmlTitle = 'Neues Blog - CMS - Dominik Riedig';
	res.render('editarticle', {...app.locals, ...res.locals});
});

app.post('/articles/new', async (req, res) => {
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
		RevisionRevisionId: revision.revision_id,
		article_original_publication_time: Date.now(),
		article_last_update_time: Date.now(),
		article_is_published: req.body.blogeditPublishUnlisted ? false : true,
	});
	res.redirect('/articles?success');
});

app.get('/articles/edit/:id', (_req, res) => {
	res.locals.pageTitle = 'Blog bearbeiten /blogedit';
	res.locals.htmlTitle = 'Neues Blog - CMS - Dominik Riedig';
	res.render('editarticle', {...app.locals, ...res.locals});
});

app.get('/images/:pictureid.:type', dynamicImage);

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.status(404);
	res.render('404', {...app.locals, ...res.locals});
});

export default app;
