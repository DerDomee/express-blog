import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class UserGroup extends Model {
	declare group_user_id: String;
	declare group_groupname: String;
};

export const initModel = (sequelize: Sequelize) => {
	UserGroup.init({

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
