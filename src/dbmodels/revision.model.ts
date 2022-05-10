import {DataTypes, Model, Sequelize} from 'sequelize';
import {BlogArticle} from './blogarticle.model';

/**
 *
 */
export class Revision extends Model {
	declare revision_id?: String;
	declare revision_prev_rev?: String;
	declare revision_datetime?: Date;
	declare revision_content?: any;
}

export const initModel = (sequelize: Sequelize) => {
	Revision.init({
		revision_id: {
			type: DataTypes.STRING(128),
			primaryKey: true,
			allowNull: false,
			comment: '',
		},

		revision_content: {
			type: DataTypes.TEXT,
			allowNull: false,
			comment: '',
		},
	}, {sequelize});

	Revision.belongsTo(Revision, {
		foreignKey: 'revision_prev_revision',
	});

	/* Revision.hasOne(Revision, {
		foreignKey: 'revision_prev_revision',
	});*/
};
