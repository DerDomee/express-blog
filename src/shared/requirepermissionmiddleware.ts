import {Request, Response, NextFunction} from 'express';


export default (requiredPermission: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authedUser = res.locals.auth.authedUser;

		if (await authedUser?.hasPermission(requiredPermission)) return next();

		return res.status(403).render('403', {...req.app.locals, ...res.locals});
	};
};
