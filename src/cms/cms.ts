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

app.get('/articles', (_req, res) => {
	res.locals.pageTitle = 'Artikelliste /articles';
	res.locals.htmlTitle = 'Artikelliste - CMS - Dominik Riedig';
	res.render('articles', {...app.locals, ...res.locals});
});

app.get('/articles/new', (_req, res) => {
	res.locals.pageTitle = 'Neues Blog /blogedit';
	res.locals.htmlTitle = 'Neues Blog - CMS - Dominik Riedig';
	res.render('editarticle', {...app.locals, ...res.locals});
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
