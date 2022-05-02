module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
	},
	'extends': [
		'google',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'plugins': [
		'@typescript-eslint',
	],
	'rules': {
		'indent': ['error', 'tab'],
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
	},
};
