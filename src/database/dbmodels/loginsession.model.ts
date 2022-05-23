import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class LoginSession extends Model {
	declare session_id: String;
	declare session_created_datetime: Date;
	declare session_lastused_datetime: Date;
};

export const initModel = (sequelize: Sequelize) => {
	LoginSession.init({

		group_user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
		},

		group_groupname: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false,
		},

	}, {sequelize});
};
