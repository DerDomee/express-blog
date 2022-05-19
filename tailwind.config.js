module.exports = {
	content: [
		`./src/${process.env.TW_COMPILE_SUBAPP_NAME ?? '*'}/**/*.ejs`,
		'./src/browser/**/*.js',
	],
	safelist: function(environment) {
		switch (environment) {
		case 'blog':
		case 'cms':
			return [{
				pattern: /hljs+/,
			}];
		default:
			return [];
		}
	}(process.env.TW_COMPILE_SUBAPP_NAME),
	theme: {
		hljs: {
			theme: 'night-owl',
		},
		extend: {
			colors: {
				redgray: {
					50: '#f5e9e8',
					100: '#dbcfce',
					200: '#c0b5b4',
					300: '#a69b9b',
					400: '#8c8281',
					500: '#726867',
					600: '#635150',
					700: '#4b2f2e',
					800: '#3f1e1f',
					900: '#2c0202',
				},
			},
		},
	},
	plugins: function(environment) {
		switch (environment) {
		case 'blog':
			return [
				require('@tailwindcss/typography'),
				require('tailwind-highlightjs'),
			];
		case 'cms':
			return [
				require('@tailwindcss/typography'),
				require('@tailwindcss/forms'),
				require('tailwind-highlightjs'),
			];
		default:
			return [];
		}
	}(process.env.TW_COMPILE_SUBAPP_NAME),
};
