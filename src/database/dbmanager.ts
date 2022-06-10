import {Sequelize} from 'sequelize-typescript';
import logger from '../mean/logger';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import BlogArticleRevision from './dbmodels/blogarticlerevision.model';
import BlogArticle from './dbmodels/blogarticle.model';
import User from './dbmodels/user.model';
import Group from './dbmodels/group.model';
import LoginSession from './dbmodels/loginsession.model';
import Permission from './dbmodels/permission.model';
import UserGroup from './dbmodels/userpermission.model';
import UserPermission from './dbmodels/usergroup.model';
import GroupPermission from './dbmodels/grouppermission.model';
import {assert} from 'console';

export type allowedEnvs = 'development' | 'test' | 'production'

const createInstance = async (NODE_ENV: allowedEnvs) => {
	let sequelizeInstance = undefined;
	const models = [BlogArticleRevision, BlogArticle, User, LoginSession, Group,
		Permission, UserGroup, UserPermission, GroupPermission];
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
	const newPassword = crypto.randomBytes(16).toString('base64url');
	logger.warn('#####################################');
	logger.warn('!!! USER TABLE IS EMPTY! CREATING !!!');
	logger.warn('!!!   NEW ADMIN USER WITH RANDOM  !!!');
	logger.warn('!!!            PASSWORD           !!!');
	logger.warn('#####################################');
	logger.warn(`New username: admin`);
	logger.warn(`New password: ${newPassword}`);
	logger.warn('');
	logger.warn('This password will not be shown anywhere else again.');
	logger.warn('If you don\'t save the password now, you won\'t have access');
	logger.warn('to this instances login and can\'t create new accounts!');
	logger.warn('If you lose this password, you need to delete ALL data in your');
	logger.warn('configured database!');
	const newUser = await User.create({
		username: 'admin',
		disabled: false,
		creation_time: Date.now(),
		password_hash: await bcrypt.hash(newPassword, 15),
	});
	const newGroup = await Group.create({
		name: 'admin',
	});
	const newPermission = await Permission.create({
		name: '*',
		description: 'This permission is virtually all permissions.',
	});

	newGroup.$add('permissions', newPermission);

	newUser.$add('groups', newGroup);
	newUser.$add('permissions', newPermission);
};

const checkSeeders = async (sequelizeInstance: Sequelize) => {
	const initUser = await User.findOne({
		include: [Group, Permission],
	});
	assert(initUser, 'initUser is not set');
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await syncModels(sequelize, NODE_ENV);

	await initSeeders(sequelize);
	await checkSeeders(sequelize);

	return sequelize;
};
