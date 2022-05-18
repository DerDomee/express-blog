import path from 'path';
import fs from 'fs';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import moment from 'moment';
import {Op} from 'sequelize';
import * as PImage from 'pureimage';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';
import {BlogArticle} from '../database/dbmodels/blogarticle.model';
import {Revision} from '../database/dbmodels/revision.model';

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
			include: {
				model: Revision,
				as: 'revision_pointer',
			},
		})
	).forEach((element) => {
		try {
			const plainElem = element.get({plain: true});
			plainElem.revision_pointer.revision_content = JSON.parse(
				plainElem.revision_pointer.revision_content,
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
			include: {
				model: Revision,
				as: 'revision_pointer',
			},
		})
	).get({plain: true});
	res.locals.article = article;
	try {
		res.locals.revision = JSON.parse(article.revision_pointer.revision_content);
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

app.get('/images/:pictureid.:type', async (req, res, next) => {
	// Supported filetypes
	const fileExtToMimeSubtype = {
		bmp: 'bmp',
		svg: 'svg+xml',
		png: 'png',
		jpeg: 'jpeg',
		jpg: 'jpeg',
		avif: 'avif',
		gif: 'gif',
		webp: 'webp',
	};

	const pictureid = req.params.pictureid;
	const type = req.params.type as keyof typeof fileExtToMimeSubtype;
	const mimetype = fileExtToMimeSubtype[type];

	if (mimetype == undefined) {
		res.status(415);
		res.end();
		return;
	}

	const createPlaceholderImage = async () => {
		const width = 400;
		const height = 300;
		const image = PImage.make(width, height, {});
		const ctx = image.getContext('2d');
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = 'green';
		ctx.strokeStyle = 'green';
		/* ctx.fillRect(0, 0, width, 3);
		ctx.fillRect(0, 0, 3, height);
		ctx.fillRect(width-3, 0, width, height);
		ctx.fillRect(0, height-3, width, height);*/
		ctx.lineWidth = 15;
		ctx.strokeRect(0, 0, width - 4, height - 4);
		await fs.promises.mkdir('data/images', {recursive: true});
		await PImage.encodeJPEGToStream(
			image,
			fs.createWriteStream(`data/images/${pictureid}.jpeg`),
		);
	};

	try {
		const image = await fs.promises.readFile(
			`data/images/${pictureid}.${type}`,
		);
		res.setHeader('Content-Type', `image/${mimetype}`);
		res.end(image);
	} catch (err) {
		if (type === 'jpeg') {
			await createPlaceholderImage();
			const image = await fs.promises.readFile(
				`data/images/${pictureid}.${type}`,
			);
			res.setHeader('Content-Type', `image/${mimetype}`);
			res.end(image);
			return;
		}
		res.setHeader('Content-Type', 'application/json');
		res.status(404);
		res.end();
	}
});

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.status(404);
	res.render('404', {...app.locals, ...res.locals});
});

export default app;
