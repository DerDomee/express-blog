import {
	DataTypes,
	Model,
	Sequelize} from 'sequelize';

/**
 *
 */
export class Group extends Model {
	declare group_id: String;
	declare group_name: String;
};

export const initModel = (sequelize: Sequelize) => {
	Group.init({

		group_id: {
			type: DataTypes.UUIDV4,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},

		group_name: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false,
		},

	}, {sequelize});
};
