import path from 'path';
import fs from 'fs';
import express from 'express';
import crypto from 'crypto';
import navigation from './navigation';
import moment from 'moment';
import * as PImage from 'pureimage';
import showdownInstance from '../mean/showdown';
import helmet from '../mean/helmet';
import heroicon from '../mean/heroicon';

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
app.use(express.static('./dist/cloudcenter/public'));

// Code and dynamic routes

app.get('/', (_req, res) => {
	res.locals.pageTitle = 'Home Page /';
	res.locals.htmlTitle = 'Dominik Riedig - Blog und Projekte';
	res.render('home', {...app.locals, ...res.locals});
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
