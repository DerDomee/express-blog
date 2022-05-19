import {DataTypes, Model, Sequelize} from 'sequelize';
import {User} from './user.model';

/**
 *
 */
export class UserGroup extends Model {
	declare group_user_id: String;
	declare group_groupname: String;
};

export const initModel = async (sequelize: Sequelize) => {
	UserGroup.init({

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

	UserGroup.belongsTo(User);
	User.hasMany(UserGroup);
};
