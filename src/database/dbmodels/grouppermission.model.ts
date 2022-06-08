import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class GroupPermission extends Model {
	grouppermission_id: string;
};

export const initModel = (sequelize: Sequelize) => {
	GroupPermission.init({
		grouppermission_id: {
			type: DataTypes.UUIDV4,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
	}, {sequelize});
};
