import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	BelongsTo,
	ForeignKey} from 'sequelize-typescript';
import Revision from './revision.model';

@Table
/**
 *
 */
export default class BlogArticle extends Model {
	@PrimaryKey
	@Column({
		type: DataType.UUIDV4})
		article_id: string;

	@Column({
		type: DataType.STRING})
		article_url_id: String;

	@Column({
		type: DataType.DATE})
		article_original_publication_time: Date;

	@Column({
		type: DataType.DATE})
		article_last_update_time: Date;

	@Column({
		type: DataType.BOOLEAN})
		article_is_published: Boolean;


	@ForeignKey(() => Revision)
	@Column({
		type: DataType.STRING})
		article_current_revision_id: string;
	@BelongsTo(() => Revision)
		article_current_revision: Revision;
}
