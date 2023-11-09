/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable node/no-process-env */
const path = require('path');

module.exports = {
	entry: {
		'blog/public/blog': './src/browser/blog.ts',
		'blog/public/serviceworker': './src/browser/serviceworker.ts',
		'cms/public/cms': './src/browser/cms.ts',
		'cms/public/serviceworker': './src/browser/serviceworker.ts',
		'cloudcenter/public/cloudcenter': './src/browser/cloudcenter.ts',
		'cloudcenter/public/serviceworker': './src/browser/serviceworker.ts',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
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
