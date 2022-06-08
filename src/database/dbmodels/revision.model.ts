import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 *
 */
export class Revision extends Model {
	declare revision_id?: string;
	declare revision_datetime?: Date;
	declare revision_content?: any;
}

export const initModel = (sequelize: Sequelize) => {
	Revision.init({
		revision_id: {
			type: DataTypes.STRING(128),
			primaryKey: true,
			allowNull: false,
		},

		revision_content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},

		revision_datetime: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	}, {sequelize});
};
