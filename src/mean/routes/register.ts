import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {v4 as uuidV4} from 'uuid';
import {Route} from '../types';
import User from '../../database/dbmodels/user.model';
import logger from '../logger';

/**
 *
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
function get(req: Request, res: Response, next: NextFunction) {
	res.render('register', {...req.app.locals, ...res.locals});
}

/**
 * @param {Request} req
 * @param {Reponse} res
 * @param {NextFunction} next
 */
async function post(req: Request, res: Response, next: NextFunction) {
	res.type('json');

	if (req.body.masterPassword !== 'DbPmm1Zh') {
		res.send({
			status: 403,
			statusText: 'Forbidden',
			errorReason: 'Master password does not match!',
		});
		return;
	}
	if (!req.body.userUsername ||
				 req.body.userPassword !== req.body.userPasswordRepeat ) {
		res.send({
			status: 400,
			statusText: 'Bad Request',
			errorReason: 'Username is empty or taken or passwords don\'t match',
		});
		return;
	}
	const hashedPw = await bcrypt.hash(req.body.userPassword, 12);

	try {
		const newuser = User.build({
			user_id: uuidV4(),
			user_username: req.body.userUsername,
			user_creation_time: Date.now(),
			user_disabled: true,
			user_password_hash: hashedPw,
		});
		await newuser.save();
	} catch (err) {
		res.send({
			status: 500,
			statusText: 'Internal Server Error',
			errorReason: 'Error while saving to database. Retry in a few seconds.',
		});
		logger.verbose(err);
		logger.verbose(err.stack);
		return;
	}

	res.send({
		status: 200,
		statusText: 'OK',
	});
}

export default {
	routeMatcher: '/register',
	get: get,
	post: post,
} as Route;
