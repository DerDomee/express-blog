import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cluster from 'cluster';
import express from 'express';
import crypto from 'crypto';
import helmet from 'helmet';
import {load as cheerioLoad} from 'cheerio';
import logger from './logger';
import navigation from './navigation';
import moment from 'moment';
import dbInit, {allowedEnvs} from './dbmanager';
import {BlogArticle} from './dbmodels/blogarticle.model';
import {Revision} from './dbmodels/revision.model';
import {Op} from 'sequelize';
import showdown from 'showdown';
import hljs from 'highlight.js';

dotenv.config();
const showdownInstance = new showdown.Converter({
	headerLevelStart: 2,
	ghCompatibleHeaderId: true,
	strikethrough: true,
	tables: true,
	tasklists: true,
	requireSpaceBeforeHeadingText: true,
	splitAdjacentBlockquotes: true,
	disableForced4SpacesIndentedSublists: true,
	extensions: [
		{
			// This starts a scrollable table inside a tailwind prose, wraps around.
			type: 'output',
			regex: /{{starttable}}/g,
			replace: '<div class="overflow-x-auto">',
		},
		{
			// This ends a scrollable table inside a tailwind prose, wraps around.
			type: 'output',
			regex: /{{endtable}}/g,
			replace: '</div>',
		},
		{
			// This uses highlight.js for codeblocks
			type: 'output',
			filter: (text, converter, options) => {
				const left = '<pre><code\\b[^>]*>';
				const right = '</code></pre>';
				const flags = 'g';
				const repl = (_wholeMatch: any, match: any, left: any, right: any) => {
					match = match
						.replace(/&amp;/g, '&')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');
					return left + hljs.highlightAuto(match).value + right;
				};
				return showdown.helper.replaceRecursiveRegExp(
					text, repl, left, right, flags);
			},
		},
	],
});


const port = process.env.SERVER_PORT ?? 3000;
const workerId = cluster?.worker?.id ?? 'DEV';

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

// Helmet itself
app.use(helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			scriptSrc: [
				'\'self\'',
				process.env.NODE_ENV === 'development' ? '\'unsafe-eval\'': '',
				(_req, res: any) => `'nonce-${res.locals.cspNonce}'`,
			],
			workerSrc: ['\'self\''],
			styleSrc: ['\'self\'', 'https: \'unsafe-inline\''],
			upgradeInsecureRequests: [],
		},
	},
}));

// Heroicons function in renderer
app.use((_req, res, next) => {
	interface Icon {
		icon: string,
		style?: 'outline' | 'solid',
		classes?: string,
	}

	/**
	 * Import a heroicon svg and render it as html with any given
	 * classes or parameters
	 * @param {Icon} icon Icon
	 * @return {String} SVG
	 */
	res.locals.heroicon = (icon: Icon): string => {
		icon.style = icon.style ?? 'outline';
		icon.classes = icon.classes ?? '';
		const filepath = path
			.join('node_modules', 'heroicons', icon.style, `${icon.icon}.svg`);
		let svg = '';
		try {
			svg = fs.readFileSync(filepath).toString();
		} catch (err) {
			return `{{heroicon:${icon.style}/${icon.icon}\
			        ${icon.classes ? `; ${icon.classes}` : ''}}}`;
		}
		const $ = cheerioLoad(svg, {}, false);
		$('svg').addClass(icon.classes);
		return $.html();
	};
	next();
});


// Static routes
app.use(express.static('./dist/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = 'Home Page /';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('home', {...app.locals, ...res.locals});
});

// Main Route (and canonical route) for the article browser
app.get('/articles', async (_req, res) => {
	res.locals.pageTitle = 'Artikelbrowser';
	res.locals.htmlTitle = 'Blog - Dominik Riedig';
	res.locals.allArticles = [] as BlogArticle[];
	(await BlogArticle.findAll({
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
	})).forEach((element) => {
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
	const article = (await BlogArticle.findOne({
		where: {
			article_url_id: articleurl,
		},
		include: {
			model: Revision,
			as: 'revision_pointer',
		},
	})).get({plain: true});
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

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.status(404);
	res.render('404', {...app.locals, ...res.locals});
});

dbInit(process.env.NODE_ENV as allowedEnvs).then((sequelize) => {
	app.set('sequelizeInstance', sequelize);
	// Start listening with this instance on specified port (cluster worker mode)
	app.locals.httpInstance = app.listen(port, () => {
		logger.info(`w${workerId} | Listening on port ${port}`);
	});
});


