module.exports = {
	content: ['./src/**/*.{ejs,html,js,ts}'],
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
