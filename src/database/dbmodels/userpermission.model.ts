import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class UserPermission extends Model {
	userpermission_id: string;
};

export const initModel = (sequelize: Sequelize) => {
	UserPermission.init({
		userpermission_id: {
			type: DataTypes.UUIDV4,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
	}, {sequelize});
};
