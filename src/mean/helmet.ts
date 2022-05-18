import helmet from 'helmet';

export default helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			scriptSrc: [
				'\'self\'',
				process.env.NODE_ENV === 'development' ? '\'unsafe-eval\'' : '',
				(_req, res: any) => `'nonce-${res.locals.cspNonce}'`,
			],
			workerSrc: ['\'self\''],
			styleSrc: ['\'self\'', 'https: \'unsafe-inline\''],
			upgradeInsecureRequests: [],
		},
	},
});
