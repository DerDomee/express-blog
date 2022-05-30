import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
	verbose: false,
	testEnvironment: 'node',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testRegex: '.(test|spec).(ts|ts)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

module.exports = config;
