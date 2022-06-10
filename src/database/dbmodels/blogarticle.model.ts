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
import BlogArticleRevision from './blogarticlerevision.model';

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
		url_id: String;

	@Default(DataType.NOW)
	@AllowNull(false)
	@Column({
		type: DataType.DATE})
		original_publication_time: Date;

	@Default(DataType.NOW)
	@AllowNull(true)
	@Column({
		type: DataType.DATE})
		last_update_time: Date;

	@AllowNull(false)
	@Column({
		type: DataType.BOOLEAN})
		is_published: Boolean;


	@ForeignKey(() => BlogArticleRevision)
	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		current_revision_id: string;
	@BelongsTo(() => BlogArticleRevision)
		current_revision: BlogArticleRevision;
}
