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

export const initModel = async (sequelize: Sequelize) => {
	BlogArticle.init({

		article_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			comment: 'Incrementing and unique identifying id number for this article',
		},

		article_url_id: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			comment: 'Unique identifying url id pointing to this article',
		},

		article_original_publication_time: {
			type: DataTypes.DATE,
			allowNull: false,
			comment: 'Datetime of first publication. If this is in the future, the ' +
			         'article becomes a scheduled pre-release article',
		},

		article_last_update_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			comment: 'Datetime of last update or content change',
		},

		article_is_published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
			comment: 'If this article is published. If false, it does not appear ' +
			         'in the article browser, but still can be accessed via direct ' +
			         'link.',
		},

	}, {sequelize});

	BlogArticle.belongsTo(Revision, {
		foreignKey: 'article_current_revision',
		as: 'revision_pointer',
	});
};
