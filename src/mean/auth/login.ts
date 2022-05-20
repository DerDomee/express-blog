import {NextFunction, Request, Response} from 'express';
import {User} from '../../database/dbmodels/user.model';
import bcrypt from 'bcrypt';

export default {

	get: (req: Request, res: Response, _next: NextFunction) => {
		res.render('login', {...req.app.locals, ...res.locals});
	},

	post: async (req: Request, res: Response, _next: NextFunction) => {
		res.type('json');

		if (!req.body.username || !req.body.password) {
			res.send({
				status: 400,
				statusText: 'Bad Request',
				errorReason: 'Username or password is empty',
			});
			return;
		}

		const queriedUser = await User.findOne({where: {
			user_username: req.body.username,
		}});

		if (queriedUser === null || !await bcrypt.compare(
		    req.body.password,
		    queriedUser.user_password_hash)) {
			res.send({
				status: 401,
				statusText: 'Unauthorized',
				errorReason: 'Username or password incorrect!',
			});
			return;
		}

		// TODO: Generate session cookie based on requested cookie lifetime
		//       provided with 'persistentLogin' form field.

		res.send({
			status: 200,
			statusText: 'OK',
			authedAs: queriedUser.user_username,
		});
	},

};
