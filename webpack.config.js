const path = require('path');

module.exports = {
	entry: {
		blog: './src/browser/blog.js',
		cms: './src/browser/cms.js',
		cloudcenter: './src/browser/cloudcenter.js',
		serviceworker: './src/browser/serviceworker.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'public'),
		filename: '[name].js',
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'development' ? false : true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
			},
		],
	},

	mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
