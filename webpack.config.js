/* eslint-disable node/no-process-env */
const path = require('path');

module.exports = {
	entry: {
		blog: './src/browser/blog.ts',
		cms: './src/browser/cms.ts',
		cloudcenter: './src/browser/cloudcenter.ts',
		serviceworker: './src/browser/serviceworker.ts',
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
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
