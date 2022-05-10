const path = require('path');

module.exports = {
	entry: {
		script: './src/frontend/main.js',
		serviceworker: './src/frontend/serviceworker.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'public'),
		filename: '[name].js',
	},
	mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
};
