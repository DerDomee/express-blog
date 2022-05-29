/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	verbose: true,
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testRegex: '.(test|spec).(ts|ts)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

module.exports = config;
