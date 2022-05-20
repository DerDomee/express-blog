import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class User extends Model {
	declare user_id: string;
	declare user_username: string;
	declare user_creation_time: Date;
	declare user_disabled: boolean;
	declare user_password_hash: string;
	declare user_email?: string;
};

export const initModel = (sequelize: Sequelize) => {
	User.init({

		user_id: {
			type: DataTypes.STRING,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
		},

		user_username: {
			type: DataTypes.STRING(32),
			unique: true,
			allowNull: false,
		},

		user_email: {
			type: DataTypes.STRING(96),
			allowNull: true,
		},

		user_creation_time: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		user_disabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},

		user_password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: true,
		},

	}, {sequelize});
};
