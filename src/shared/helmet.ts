import {Response} from 'express';
import helmet from 'helmet';
import options from '../options';

export default helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			'script-src': [
				'\'self\'',
				options.nodeEnv === 'development' ? '\'unsafe-eval\'' : '',
				(_req, res: Response) => `'nonce-${res.locals.cspNonce}'`,
			],
			'worker-src': ['\'self\''],
			'style-src': ['\'self\'', 'https: \'unsafe-inline\''],
			'upgrade-insecure-requests': [],
		},
	},
});
