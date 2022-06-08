import {
	DataTypes,
	Model,
	Sequelize} from 'sequelize';

/**
 *
 */
export class Permission extends Model {
	declare permission_id: string;
	declare permission_name: string;
	declare permission_description: string;
};

export const initModel = (sequelize: Sequelize) => {
	Permission.init({

		permission_id: {
			type: DataTypes.UUIDV4,
			autoIncrement: false,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},

		permission_name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},

		permission_description: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},

	}, {sequelize});
};
