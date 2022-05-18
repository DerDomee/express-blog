module.exports = {
	content: ['./src/blog/**/*.ejs', './src/browser/**/*.js'],
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
