import {Sequelize} from 'sequelize';
import logger from './logger';
import crypto from 'crypto';

import {Revision, initModel as revisionInit} from './dbmodels/revision.model';
import {
	BlogArticle,
	initModel as blogarticleInit} from './dbmodels/blogarticle.model';

export type allowedEnvs = 'development' | 'test' | 'production'

export const createInstance = async (NODE_ENV: allowedEnvs) => {
	let sequelizeInstance = undefined;
	switch (NODE_ENV) {
	case 'development':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './development_db.sqlite',
			logging: (...msg) => logger.debug,
		});
		break;
	case 'test':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './test_db.sqlite',
			logging: false,
		});
		break;
	case 'production':
		sequelizeInstance = new Sequelize(
			process.env.DD_DBNAME,
			process.env.DD_DBUSER,
			process.env.DD_DBPASS,
			{
				dialect: 'mysql',
				logging: false,
			});
		break;
	default:
		throw new RangeError(`NODE_ENV is of an invalid state: '${NODE_ENV}'`);
	}
	return sequelizeInstance;
};

export const loadModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	revisionInit(sequelizeInstance);
	blogarticleInit(sequelizeInstance);
};

export const syncModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	await sequelizeInstance.sync({
		alter: NODE_ENV==='development' ? true : false,
		force: NODE_ENV==='development' ? true : false,
		logging: NODE_ENV==='development' ? false : false,
	});
};

const doSomeTests = async (sequelize: Sequelize) => {
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await loadModels(sequelize, NODE_ENV);
	await syncModels(sequelize, NODE_ENV);
	await doSomeTests(sequelize);

	return sequelize;
};
