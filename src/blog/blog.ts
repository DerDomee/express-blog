import path from 'path';
import http from 'http';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import moment from 'moment';
import useragent from 'express-useragent';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import showdownInstance from '../shared/showdown';
import helmet from '../shared/helmet';
import heroicon from '../shared/heroicon';
import checkauth from '../shared/middleware/checkauth';

import routes from './routes/_routes';

const app = express();
const server = http.createServer(app);

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(useragent.express());
app.use(checkauth);
app.use(heroicon);

app.use(express.static('./dist/blog/public'));

// Code and dynamic routes

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
