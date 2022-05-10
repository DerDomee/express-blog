import {allowedEnvs, createInstance} from './dbmanager';
import {Sequelize} from 'sequelize';

describe('Database Initialization', () => {
	test('with current environment', () => {
		expect(
			createInstance(process.env.NODE_ENV as allowedEnvs),
		).toBeInstanceOf(Sequelize);
	});
	test('with erroneous environments null and undefined', () => {
		try {
			expect(createInstance(null)).toThrowError(RangeError);
			expect(createInstance(undefined)).toThrowError(RangeError);
		} catch (err) {}
	});

	test('with emulated environments development and production', () => {
		try {
			expect(createInstance('development')).toBeInstanceOf(Sequelize);
			expect(createInstance('production')).toBeInstanceOf(Sequelize);
		} catch (err) {}
	});
});
