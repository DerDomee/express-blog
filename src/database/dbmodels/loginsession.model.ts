import {DataTypes, Model, Sequelize} from 'sequelize';
import {User} from './user.model';

/**
 *
 */
export class LoginSession extends Model {
	declare session_id: String;
	declare session_created_datetime: Date;
	declare session_lastused_datetime: Date;
	declare session_user_id: String;
};

export const initModel = async (sequelize: Sequelize) => {
	LoginSession.init({

		group_user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
			comment: '',
		},

		group_groupname: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false,
			comment: '',
		},

	}, {sequelize});

	LoginSession.belongsTo(User, {
		foreignKey: 'session_for_user',
		as: 'user_pointer',
	});
};
