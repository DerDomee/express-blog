import {NextFunction, Request, Response} from 'express';
import {Route} from '../types';
import fs from 'fs';
import * as PImage from 'pureimage';

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


const createPlaceholderImage = async (
	pictureid: string,
	width: number,
	height: number,
) => {
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

	const outputWidth = isNaN(queryWidth) ? 400 : queryWidth;
	const outputHeight = isNaN(queryHeight) ? 300 : queryHeight;

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
		if (type === 'jpeg') {
			await createPlaceholderImage(pictureid, outputWidth, outputHeight);
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
}

export default {
	routeMatcher: '/images/:pictureid.:type',
	get: get,
} as Route;
