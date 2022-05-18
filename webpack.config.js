const path = require('path');

module.exports = {
	entry: {
		blog: './src/browser/blog.js',
		cms: './src/browser/cms.js',
		serviceworker: './src/browser/serviceworker.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'public'),
		filename: '[name].js',
	},

	mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
