import {NextFunction, Request, Response} from 'express';
import {User} from '../../database/dbmodels/user.model';
import bcrypt from 'bcrypt';

export default {

	get: (req: Request, res: Response, _next: NextFunction) => {
		res.locals.wrongCredentials = false;
		res.render('login', {...req.app.locals, ...res.locals});
	},

	post: async (req: Request, res: Response, next: NextFunction) => {
		const username = req.body.username;
		const password = req.body.password;

		res.locals.wrongCredentials = false;

		let authed = false;

		const user = await User.findOne({where: {
			user_username: username,
		}});

		if (await bcrypt.compare(password, user?.user_password_hash ?? '')) {
			authed = true;
		}

		if (!authed) {
			res.locals.wrongCredentials = true;
			res.status(401).render('login', {...req.app.locals, ...res.locals});
			res.end();
			return;
		}

		// TODO: Generate session cookie based on requested cookie lifetime
		//       provided with 'persistentLogin' form field.
		res.status(200).redirect('/');
	},

};
