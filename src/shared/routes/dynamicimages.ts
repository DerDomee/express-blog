import {NextFunction, Request, Response} from 'express';
import {Route} from '../types';
import fs from 'fs';

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

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
	const pictureid = req.params.pictureid;
	const type = req.params.type as keyof typeof fileExtToMimeSubtype;
	const mimetype = fileExtToMimeSubtype[type];
	const queryWidth: number = parseInt(`${req.query.w}`);
	const queryHeight: number = parseInt(`${req.query.h}`);

	const outputWidth = Number.isNaN(queryWidth) ? 400 : queryWidth;
	const outputHeight = Number.isNaN(queryHeight) ? 300 : queryHeight;

	if (mimetype == undefined) {
		res.status(415);
		res.end();
		return;
	}

	try {
		const image = await fs.promises.readFile(
			`data/images/${pictureid}.${type}`,
		);
		res.setHeader('Content-Type', `image/${mimetype}`);
		res.end(image);
	} catch (err) {
		res.setHeader('Content-Type', 'application/json');
		res.status(404);
		res.end();
	}
}

export default {
	routeMatcher: '/images/:pictureid.:type',
	get: get,
} as Route;
