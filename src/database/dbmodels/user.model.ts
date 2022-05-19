import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class User extends Model {
	declare user_id: String;
	declare user_username: String;
	declare user_email: String;
	declare user_creation_time: Date;
	declare user_disabled: boolean;
	declare user_password_hash: String;
	declare user_password_salt: String;
	declare user_groups: String[];
};

export const initModel = async (sequelize: Sequelize) => {
	User.init({

		user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
			comment: '',
		},

		user_username: {
			type: DataTypes.STRING(32),
			unique: true,
			allowNull: false,
			comment: '',
		},

		user_email: {
			type: DataTypes.STRING(96),
			allowNull: true,
			comment: '',
		},

		user_creation_time: {
			type: DataTypes.DATE,
			allowNull: false,
			comment: '',
		},

		user_disabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
			comment: '',
		},

		user_password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: true,
			comment: '',
		},

		user_password_salt: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: true,
			comment: '',
		},

	}, {sequelize});
};
