module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'es2021': true,
	},
	'extends': [
		'google',
		'plugin:node/recommended',
		'plugin:@typescript-eslint/recommended',
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
		'comma-dangle': ['error', 'always-multiline'],
		'comma-spacing': ['error', {
			before: false,
			after: true,
		}],
		'comma-style': ['error', 'last'],
		'indent': ['error', 'tab'],
		'new-cap': ['error', {
			properties: false,
		}],
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
		'new-cap': ['error', {
			'capIsNew': false,
		}],

		'node/no-process-env': 'error',
		'node/no-unsupported-features/es-syntax': ['error', {
			'ignores': ['modules'],
		}],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', {
			'vars': 'all',
			'args': 'none',
		}],
		'node/no-missing-import': ['error', {
			'allowModules': [],
			'resolvePaths': [],
			'tryExtensions': ['.js', '.ts'],
		}],
		'node/no-unpublished-import': 'error',

		'@typescript-eslint/no-empty-function': 'off',
	},
};
