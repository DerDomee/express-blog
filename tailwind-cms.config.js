module.exports = {
	content: ['./src/cms/**/*.ejs', './src/browser/**/*.js'],
	safelist: [{
		pattern: /hljs+/,
	}],
	theme: {
		hljs: {
			theme: 'night-owl',
		},
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwind-highlightjs'),
	],
};
