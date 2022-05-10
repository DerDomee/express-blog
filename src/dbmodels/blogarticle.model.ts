import {DataTypes, Model, Sequelize} from 'sequelize';
import {Revision} from './revision.model';

/**
 *
 */
export class BlogArticle extends Model {
	declare article_id: Number;
	declare article_url_id: String;
	declare article_current_revision: Revision;
	declare article_original_publication_time: Date;
	declare article_last_update_time: Date;
	declare article_is_published: Boolean;
}

export const initModel = (sequelize: Sequelize) => {
	BlogArticle.init({

		article_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			comment: '',
		},

		article_url_id: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			comment: '',
		},

		article_original_publication_time: {
			type: DataTypes.DATE,
			allowNull: false,
			comment: '',
		},

		article_last_update_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			comment: '',
		},

		article_is_published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
			comment: '',
		},

	}, {sequelize});

	BlogArticle.belongsTo(Revision, {
		foreignKey: 'article_current_revision',
		as: 'revision_pointer',
	});

	/* Revision.hasOne(BlogArticle, {
		foreignKey: 'article_current_revision',
	});*/
};
