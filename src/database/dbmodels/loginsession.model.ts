import {DataTypes, Model, Sequelize} from 'sequelize';
import {User} from './user.model';

/**
 *
 */
export class LoginSession extends Model {
	declare session_cookie: String;
	declare session_created_datetime: Date;
	declare session_expires_datetime: Date;
	declare session_is_persistent: boolean;
	declare session_lastused_datetime: Date;
	declare session_original_useragent?: string;
	declare session_current_useragent?: string;
	declare session_original_ip?: string;
	declare session_current_ip?: string;
	declare User?: User;
};

export const initModel = (sequelize: Sequelize) => {
	LoginSession.init({

		session_cookie: {
			type: DataTypes.STRING(128),
			autoIncrement: false,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},

		session_created_datetime: {
			type: DataTypes.DATE,
			unique: false,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},

		session_expires_datetime: {
			type: DataTypes.DATE,
			unique: false,
			allowNull: false,
		},

		session_is_persistent: {
			type: DataTypes.BOOLEAN,
			unique: false,
			allowNull: false,
		},

		session_lastused_datetime: {
			type: DataTypes.DATE,
			unique: false,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},

		session_original_useragent: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},

		session_current_useragent: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},

		session_original_ip: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},

		session_current_ip: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},

	}, {sequelize});
};
