import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class UserGroup extends Model {
	usergroup_id: string;
};

export const initModel = (sequelize: Sequelize) => {
	UserGroup.init({
		usergroup_id: {
			type: DataTypes.UUIDV4,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
	}, {sequelize});
};
