import {DataTypes, Model, Sequelize} from 'sequelize';
import {Revision} from './revision.model';

/**
 *
 */
export class BlogArticle extends Model {
	declare article_id: Number;
	declare article_url_id: String;
	declare article_original_publication_time: Date;
	declare article_last_update_time: Date;
	declare article_is_published: Boolean;
	declare Revision?: Revision;
}

export const initModel = (sequelize: Sequelize) => {
	BlogArticle.init({

		article_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},

		article_url_id: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},

		article_original_publication_time: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		article_last_update_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
		},

		article_is_published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},

	}, {sequelize});
};
