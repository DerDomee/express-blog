import path from 'path';
import http from 'http';
import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import navigation from './navigation';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';
import checkauth from '../mean/checkauth';
import moment from 'moment';

import routes from './routes/_routes';

const app = express();
moment.locale('de');
app.locals.moment = moment;
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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(useragent.express());
app.use(checkauth);
app.use(heroicon);

app.use(express.static('./dist/cloudcenter/public'));
app.use('/videos', express.static('./data/videos'));

app.use((_req, res, next) => {
	const returnPath = app.get('blogAbsPath');
	if (!res.locals.auth.isAuthed) {
		res.redirect(`${returnPath}/login`);
		return;
	}
	next();
});

for (const route of routes) {
	if (typeof(route.routeMatcher) === 'string') {
		route.routeMatcher = [route.routeMatcher];
	}
	for (const match of route.routeMatcher) {
		if (route.get) app.get(match, route.get);
		if (route.head) app.head(match, route.head);
		if (route.post) app.post(match, route.post);
		if (route.put) app.put(match, route.put);
		if (route.delete) app.delete(match, route.delete);
		if (route.connect) app.connect(match, route.connect);
		if (route.options) app.options(match, route.options);
		if (route.trace) app.trace(match, route.trace);
		if (route.patch) app.patch(match, route.patch);
	}
}



export default {
	server,
	app,
};
