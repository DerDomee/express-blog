import {Sequelize} from 'sequelize';
import logger from '../mean/logger';
import bcrypt from 'bcrypt';

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
	Group,
	initModel as groupInit} from './dbmodels/group.model';
import {
	LoginSession,
	initModel as loginSessionInit} from './dbmodels/loginsession.model';
import {
	Permission,
	initModel as permissionInit} from './dbmodels/permission.model';
import {
	UserGroup,
	initModel as userGroupInit} from './dbmodels/usergroup.model';
import {
	GroupPermission,
	initModel as groupPermissionInit} from './dbmodels/grouppermission.model';
import {
	UserPermission,
	initModel as userPermissionInit} from './dbmodels/userpermission.model';

export type allowedEnvs = 'development' | 'test' | 'production'

const createInstance = async (NODE_ENV: allowedEnvs) => {
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

const loadModels = async (sequelizeInstance: Sequelize) => {
	revisionInit(sequelizeInstance);
	blogarticleInit(sequelizeInstance);
	userInit(sequelizeInstance);
	groupInit(sequelizeInstance);
	loginSessionInit(sequelizeInstance);
	permissionInit(sequelizeInstance);
	userGroupInit(sequelizeInstance);
	groupPermissionInit(sequelizeInstance);
	userPermissionInit(sequelizeInstance);

	// Blog Article points to its latest revision (and back)
	BlogArticle.belongsTo(Revision);
	Revision.hasOne(BlogArticle);

	// Revision points to its prior revision (but not back to prevent cyclic deps)
	Revision.hasOne(Revision);

	// User points to all of his groups (and group points back)
	User.belongsToMany(Group, {through: UserGroup});
	Group.belongsToMany(User, {through: UserGroup});

	// Group can have many permissions
	Group.belongsToMany(Permission, {through: GroupPermission});
	Permission.belongsToMany(Group, {through: GroupPermission});

	// Users can have many permissions
	User.belongsToMany(Permission, {through: UserPermission});
	Permission.belongsToMany(User, {through: UserPermission});

	// User points to all of his login sessions (and sessions point back to him)
	User.hasMany(LoginSession);
	LoginSession.belongsTo(User);
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
	const allPermission = await Permission.create({
		permission_name: '*',
		permission_description: 'This permission is virtually all permissions.',
	});
	await GroupPermission.create({
		PermissionPermissionId: allPermission.permission_id,
		GroupGroupId: newGroup.group_id,
	});
	await UserPermission.create({
		UserUserId: newUser.user_id,
		PermissionPermissionId: allPermission.permission_id,
	});
	await UserGroup.create({
		UserUserId: newUser.user_id,
		GroupGroupId: newGroup.group_id,
	});
};

const checkSeeders = async (sequelizeInstance: Sequelize) => {
	const initUser = await User.findOne({
		include: [{
			all: true,
		}],
	});

	logger.verbose(initUser);
};

export default async (NODE_ENV: allowedEnvs) => {
	const sequelize = await createInstance(NODE_ENV);
	await loadModels(sequelize);
	await syncModels(sequelize, NODE_ENV);
	await initSeeders(sequelize);
	await checkSeeders(sequelize);

	return sequelize;
};
