import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	BelongsTo,
	ForeignKey,
	AutoIncrement,
	AllowNull,
	Unique,
	Default} from 'sequelize-typescript';
import Revision from './revision.model';

@Table
/**
 *
 */
export default class BlogArticle extends Model {
	@PrimaryKey
	@AutoIncrement
	@AllowNull(false)
	@Column({
		type: DataType.INTEGER})
		article_id: number;

	@Unique
	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		article_url_id: String;

	@Default(DataType.NOW)
	@AllowNull(false)
	@Column({
		type: DataType.DATE})
		article_original_publication_time: Date;

	@Default(DataType.NOW)
	@AllowNull(true)
	@Column({
		type: DataType.DATE})
		article_last_update_time: Date;

	@AllowNull(false)
	@Column({
		type: DataType.BOOLEAN})
		article_is_published: Boolean;


	@ForeignKey(() => Revision)
	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		article_current_revision_id: string;
	@BelongsTo(() => Revision)
		article_current_revision: Revision;
}
