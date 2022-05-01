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

dotenv.config();

const port = process.env.SERVER_PORT ?? 3000;

const app = express();

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
			scriptSrc: ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-eval'": "" , (_req, res: any) => `'nonce-${res.locals.cspNonce}'`],
			workerSrc: ["'self'"],
		}
	}
}));

// Heroicons function in renderer
app.use((_req, res, next) => {
	interface Icon {
		icon: string,
		style?: 'outline' | 'solid',
		classes?: string,
	}
	/**
	 * Import a heroicon svg and render it as html with any given classes or parameters
	 * @param param0 Icon
	 * @returns svg
	 */
	res.locals.heroicon = (icon: Icon): string => {
		icon.style = icon.style ?? 'outline';
		icon.classes = icon.classes ?? '';
		const filepath = path.join('node_modules', 'heroicons', icon.style, `${icon.icon}.svg`);
		let svg = "";
		try {
			svg = fs.readFileSync(filepath).toString();
		}
		catch (err) {
			return `{{heroicon:${icon.style}/${icon.icon}${icon.classes ? `; ${icon.classes}` : ''}}}`;
		}
		const $ = cheerioLoad(svg, {}, false);
		$('svg').addClass(icon.classes)
		return $.html();
	}
	next();
});

app.use((_req, res, next) => {
	res.locals.navigation = navigation
	res.locals.currentyear = new Date().getUTCFullYear();
	next();
})


// Static routes
app.use(express.static('./dist/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = "Home Page /";
	res.locals.htmlTitle = "Dominik Riedig - Blog und Projekte";
	res.render('home', res.locals);
});

// Main Route (and canonical route) for the article browser
app.get('/articles', (_req, res) => {
	res.locals.pageTitle = "Artikelbrowser";
	res.locals.htmlTitle = "Blog - Dominik Riedig";
	res.render('articlebrowser', res.locals);
});

// Fallback route if the user manually edits URL and deletes current
// articleurl, redirect to articlebrowser
app.get('/a', (req, res) => {
	res.redirect(301, '/articles');
})

// Main route (and canonical route) for a specific article;
app.get('/a/:articleurl', (req, res) => {
	const articleurl = req.params.articleurl;
	res.locals.pageTitle = `"${articleurl}" Blogview`;
	res.locals.htmlTitle = `${articleurl} - Dominik Riedig`;
	res.render('article', res.locals);
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
	res.locals.pageTitle = "Meine Projekte";
	res.locals.htmlTitle = "Projekte - Dominik Riedig";
	res.render('projectbrowser', res.locals);
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
	res.render('project', res.locals);
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
	res.locals.pageTitle = "Über mich";
	res.locals.htmlTitle = "Über mich - Dominik Riedig";
	res.render('aboutme', res.locals);
});

// Main route for page settings (client side)
app.get('/settings', (_req, res) => {
	res.locals.pageTitle = "Website-Einstellungen";
	res.locals.htmlTitle = "Einstellungen - Dominik Riedig";
	res.render('settings', res.locals);
});

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.render('404', res.locals);
});


// Start listening with this instance on specified port (cluster worker mode)
app.locals.httpInstance = app.listen(port, () => {
	logger.info(`w${cluster.worker.id} | Listening on port ${port}`);
});
