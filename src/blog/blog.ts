import path from 'path';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import moment from 'moment';
import {Op} from 'sequelize';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';
import {BlogArticle} from '../database/dbmodels/blogarticle.model';
import {Revision} from '../database/dbmodels/revision.model';
import dynamicImage from '../mean/dynamicImage';

const app = express();

moment.locale('de');
app.locals.navigation = navigation;
app.locals.moment = moment;
app.locals.currentyear = new Date().getUTCFullYear();
app.locals.showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create nonce for helmet CSP script-src using nonce
app.use((_req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
	next();
});

app.use(helmet);
app.use(heroicon);
app.use(express.static('./dist/blog/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = 'Home Page /';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('home', {...app.locals, ...res.locals});
});

// Main Route (and canonical route) for the article browser
app.get('/articles', async (req, res) => {
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
			const plainElem = element.get({plain: true});
			plainElem.Revision.revision_content = JSON.parse(
				plainElem.Revision.revision_content,
			);
			res.locals.allArticles.push(plainElem);
		} catch (err) {}
	});

	res.render('articlebrowser', {...app.locals, ...res.locals});
});

// Fallback route if the user manually edits URL and deletes current
// articleurl, redirect to articlebrowser
app.get('/a', (req, res) => {
	res.redirect(301, '/articles');
});

// Main route (and canonical route) for a specific article;
app.get('/a/:articleurl', async (req, res) => {
	const articleurl = req.params.articleurl;
	const article = (
		await BlogArticle.findOne({
			where: {
				article_url_id: articleurl,
			},
			include: Revision,
		})
	).get({plain: true});
	res.locals.article = article;
	try {
		res.locals.revision = JSON.parse(article.Revision.revision_content);
		res.locals.metaDescription = res.locals.revision.blurb;
	} catch (err) {
		res.status(404);
		res.render('404', {...app.locals, ...res.locals});
		return;
	}
	res.locals.pageTitle = res.locals.revision.title;
	res.locals.htmlTitle = `${res.locals.revision.htmlTitle} - Dominik Riedig`;
	res.render('article', {...app.locals, ...res.locals});
});

// Fallback routes if the user manually edits URL and does not
// use /a/:articleurl canonical route. Redirect to article
app.get('/article/:articleurl', (req, res) => {
	res.redirect(301, `/a/${req.params.articleurl}`);
});
app.get('/articles/:articleurl', (req, res) => {
	res.redirect(301, `/a/${req.params.articleurl}`);
});

// Main Route (and canonical route) for the projects browser
app.get('/projects', (_req, res) => {
	res.locals.pageTitle = 'Meine Projekte';
	res.locals.htmlTitle = 'Projekte - Dominik Riedig';
	res.render('projectbrowser', {...app.locals, ...res.locals});
});

// Fallback route if the user manually edits URL and deletes current
// projecturl, redirect to projectbrowser
app.get('/p', (_req, res) => {
	res.redirect(301, '/projects');
});

// Main route (and canonical route) for a specific project
app.get('/p/:projecturl', (req, res) => {
	const projecturl = req.params.projecturl;
	res.locals.pageTitle = `"${projecturl}" Projectview`;
	res.locals.htmlTitle = `${projecturl} - Dominik Riedig`;
	res.render('project', {...app.locals, ...res.locals});
});

// Fallback routes if the user manually edits URL and does not
// use /p/:projecturl canonical route. Redirect to project
app.get('/project/:projecturl', (req, res) => {
	res.redirect(301, `/p/${req.params.projecturl}`);
});
app.get('/projects/:projecturl', (req, res) => {
	res.redirect(301, `/p/${req.params.projecturl}`);
});

app.get('/aboutme', (_req, res) => {
	res.locals.pageTitle = 'Über mich';
	res.locals.htmlTitle = 'Über mich - Dominik Riedig';
	res.render('aboutme', {...app.locals, ...res.locals});
});

// Main route for page settings (client side)
app.get('/settings', (_req, res) => {
	res.locals.pageTitle = 'Website-Einstellungen';
	res.locals.htmlTitle = 'Einstellungen - Dominik Riedig';
	res.render('settings', {...app.locals, ...res.locals});
});

app.get('/images/:pictureid.:type', dynamicImage);

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.status(404);
	res.render('404', {...app.locals, ...res.locals});
});

export default app;
