import path from 'path';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';
import dynamicImage from '../mean/dynamicImage';

const app = express();

app.locals.navigation = navigation;
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
app.use(express.static('./dist/cms/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = 'CMS /';
	res.locals.htmlTitle = 'Dominik Riedig - CMS';
	res.render('home', {...app.locals, ...res.locals});
});

app.get('/images/:pictureid.:type', dynamicImage);

// All other GET routes return a 404
app.get('*', (_req, res) => {
	res.status(404);
	res.render('404', {...app.locals, ...res.locals});
});

export default app;
