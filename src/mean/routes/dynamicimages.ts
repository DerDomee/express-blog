import {NextFunction, Request, Response} from 'express';
import {Route} from '../types';
import fs from 'fs';
import * as PImage from 'pureimage';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function get(req: Request, res: Response, next: NextFunction) {
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
}

export default {
	routeMatcher: '/images/:pictureid.:type',
	get: get,
} as Route;
