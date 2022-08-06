import helmet from 'helmet';
import options from '../options';

export default helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			scriptSrc: [
				'\'self\'',
				options.nodeEnv === 'development' ? '\'unsafe-eval\'' : '',
				(_req, res: any) => `'nonce-${res.locals.cspNonce}'`,
			],
			workerSrc: ['\'self\''],
			styleSrc: ['\'self\'', 'https: \'unsafe-inline\''],
			upgradeInsecureRequests: [],
		},
	},
});
