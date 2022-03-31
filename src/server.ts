import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cluster from 'cluster';
import express from 'express';
import crypto from 'crypto';
import helmet from 'helmet';
import logger from './logger';

dotenv.config();

const port = process.env.SERVER_PORT ?? 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((_req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
	next();
});

app.use(helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			scriptSrc: ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-eval'": "" , (_req, res: any) => `'nonce-${res.locals.cspNonce}'`],
		}
	}
}));

// Static routes
app.use(express.static('./dist/public'));

// Code and dynamic routes

app.get('/', (_req, res, _next) => {
	res.locals.pageTitle = "Home Page /";
	res.render('index', res.locals);
});

app.get('/about', (_req, res, _next) => {
	res.locals.pageTitle = "About me /about";
	res.render('index', res.locals);
});

app.get('/settings', (_req, res, _next) => {
	res.locals.pageTitle = "Settings Page /settings";
	res.render('index', res.locals);
});

app.get('*', (_req, res, _next) => {
	res.locals.pageTitle = "Undefined Page *"
	res.render('index', res.locals);
});

app.locals.httpInstance = app.listen(port, () => {
	logger.info(`w${cluster.worker.id} | Listening on port ${port}`);
});
