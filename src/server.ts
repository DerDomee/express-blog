import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cluster from 'cluster';
import express from 'express';
import crypto from 'crypto';
import helmet from 'helmet';
import cheerio from 'cheerio';
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
		}
	}
}));

// Heroicons function in renderer
app.use((_req, res, next) => {
	interface Icon {
		icon: string,
		style: 'outline' | 'solid',
		classes: string,
	}
	/**
	 * Import a heroicon svg and render it as html with any given classes or parameters
	 * @param param0 Icon
	 * @returns svg
	 */
	res.locals.heroicon = ({icon = "exclamation-circle", style = 'outline', classes = ""}: Icon): string => {
		const filepath = path.join('node_modules', 'heroicons', style, `${icon}.svg`);
		let svg = "";
		try {
			svg = fs.readFileSync(filepath).toString();
		}
		catch (err) {}
		const $ = cheerio.load(svg, {}, false);
		$('svg').addClass(classes)
		return $.html();
	}
	res.locals.heroicon("academic-cap", "outline");
	next();
});

app.use((_req, res, next) => {
	res.locals.navigation = navigation
	next();
})


// Static routes
app.use(express.static('./dist/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = "Home Page /";
	res.locals.htmlTitle = "Dominik Riedig - Blog und Projekte";
	res.render('index', res.locals);
});

app.get('/articles', (_req, res) => {
	res.locals.pageTitle = "Artikel";
	res.locals.htmlTitle = "Dominik Riedig - Blog und Projekte";
	res.render('index', res.locals);
});

app.get('/articles/:articleurl', (req, res) => {
	const articleurl = req.params.articleurl;
	res.locals.pageTitle = `"${articleurl}" Blogview`;
	res.locals.htmlTitle = `${articleurl} - Dominik Riedig`;
	res.render('index', res.locals);
});

app.get('/projects', (_req, res) => {
	res.locals.pageTitle = "Meine Projekte";
	res.locals.htmlTitle = "Projekte - Dominik Riedig";
	res.render('index', res.locals);
});

app.get('/projects/:projecturl', (req, res) => {
	const projecturl = req.params.projecturl;
	res.locals.pageTitle = `"${projecturl}" Projectview`;
	res.locals.htmlTitle = `${projecturl} - Dominik Riedig`;
	res.render('index', res.locals);
});

app.get('*', (_req, res) => {
	res.render('404', res.locals);
});

app.locals.httpInstance = app.listen(port, () => {
	logger.info(`w${cluster.worker.id} | Listening on port ${port}`);
});
