import {Sequelize} from 'sequelize-typescript';
import logger from '../mean/logger';
import bcrypt from 'bcrypt';
import util from 'util';

import Revision from './dbmodels/revision.model';
import BlogArticle from './dbmodels/blogarticle.model';
import User from './dbmodels/user.model';
import Group from './dbmodels/group.model';
import LoginSession from './dbmodels/loginsession.model';
import Permission from './dbmodels/permission.model';
import UserGroup from './dbmodels/userpermission.model';
import UserPermission from './dbmodels/usergroup.model';
import GroupPermission from './dbmodels/grouppermission.model';

export type allowedEnvs = 'development' | 'test' | 'production'

const createInstance = async (NODE_ENV: allowedEnvs) => {
	let sequelizeInstance = undefined;
	const models = [Revision, BlogArticle, User, LoginSession, Group, Permission,
		UserGroup, UserPermission, GroupPermission];
	switch (NODE_ENV) {
	case 'development':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './development_db.sqlite',
			logging: (...msg) => logger.debug,
			models: models,
		});
		break;
	case 'test':
		sequelizeInstance = new Sequelize({
			dialect: 'sqlite',
			storage: './test_db.sqlite',
			logging: false,
			models: models,
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

const syncModels = async (sequelizeInstance: Sequelize,
	NODE_ENV: allowedEnvs) => {
	await sequelizeInstance.sync({
		alter: NODE_ENV==='development' ? false : false,
		force: NODE_ENV==='development' ? false : false,
		logging: NODE_ENV==='development' ? false : false,
	});
};

const initSeeders = async (sequelizeInstance: Sequelize) => {
	if (await User.count()) return;
	const newUser = await User.create({
		user_username: 'admin',
		user_disabled: false,
		user_password_hash: await bcrypt.hash('admin', 15),
	});
	const newGroup = await Group.create({
		group_name: 'admin',
	});
	const newPermission = await Permission.create({
		permission_name: '*',
		permission_description: 'This permission is virtually all permissions.',
	});

	newUser.$add('user_groups', newGroup);
	newGroup.$add('group_permissions', newPermission);
	newUser.$add('user_permissions', newPermission);
};

const checkSeeders = async (sequelizeInstance: Sequelize) => {
	const initUser = await User.findOne({});

	logger.verbose(util.format(initUser));
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await syncModels(sequelize, NODE_ENV);

	await initSeeders(sequelize);
	await checkSeeders(sequelize);

	return sequelize;
};
