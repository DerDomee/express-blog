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
import TvShow from './dbmodels/tvshow.model';
import TvSeason from './dbmodels/tvseason.model';
import TvEpisode from './dbmodels/tvepisode.model';
import {assert} from 'console';

export type allowedEnvs = 'development' | 'test' | 'production'

const createInstance = async (options: any) => {
	let sequelizeInstance = undefined;
	const models = [BlogArticleRevision, BlogArticle, User, LoginSession, Group,
	                Permission, UserGroup, UserPermission, GroupPermission,
	                TvShow, TvSeason, TvEpisode];
	switch (options.nodeEnv) {
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
			options.dbName,
			options.dbUser,
			options.dbPass,
			{
				dialect: 'mysql',
				logging: false,
			});
		break;
	default:
		throw new RangeError(
			`NODE_ENV is of an invalid state: '${options.nodeEnv}'`);
	}
	return sequelizeInstance;
};

const syncModels = async (sequelizeInstance: Sequelize,
	options: any) => {
	await sequelizeInstance.sync({
		alter: options.nodeEnv ==='development' ? false : false,
		force: options.nodeEnv ==='development' ? false : false,
		logging: options.nodeEnv ==='development' ? false : false,
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

export default async (options: any) => {
	const sequelize = await createInstance(options);
	await syncModels(sequelize, options);

	await initSeeders(sequelize);
	await checkSeeders(sequelize);

	return sequelize;
};
