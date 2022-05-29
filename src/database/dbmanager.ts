import {Sequelize} from 'sequelize';
import logger from '../mean/logger';

import {
	Revision,
	initModel as revisionInit} from './dbmodels/revision.model';
import {
	BlogArticle,
	initModel as blogarticleInit} from './dbmodels/blogarticle.model';
import {
	User,
	initModel as userInit} from './dbmodels/user.model';
import {
	UserGroup,
	initModel as userGroupInit} from './dbmodels/usergroup.model';
import {
	LoginSession,
	initModel as loginSessionInit} from './dbmodels/loginsession.model';

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
	userInit(sequelizeInstance);
	userGroupInit(sequelizeInstance);
	loginSessionInit(sequelizeInstance);

	// Blog Article points to its latest revision (and back)
	BlogArticle.belongsTo(Revision);
	Revision.hasOne(BlogArticle);

	// Revision points to its prior revision (but not back to prevent cyclic deps)
	Revision.hasOne(Revision);

	// User points to all of his groups (and group points back)
	User.hasMany(UserGroup);
	UserGroup.belongsTo(User);

	// User points to all of his login sessions (and sessions point back to him)
	User.hasMany(LoginSession);
	LoginSession.belongsTo(User);
};

export const syncModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	await sequelizeInstance.sync({
		alter: NODE_ENV==='development' ? false : false,
		force: NODE_ENV==='development' ? false : false,
		logging: NODE_ENV==='development' ? false : false,
	});
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await loadModels(sequelize, NODE_ENV);
	await syncModels(sequelize, NODE_ENV);

	return sequelize;
};
