import {
	Table,
	Column,
	Model,
	DataType,
	HasOne,
	PrimaryKey,
	ForeignKey,
	AllowNull,
	Default} from 'sequelize-typescript';
import BlogArticle from './blogarticle.model';

@Table
/**
 *
 */
export default class BlogArticleRevision extends Model {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		blogarticlerevision_id: string;

	@Column({
		type: DataType.DATE})
		datetime: Date;

	@Column({
		type: DataType.TEXT('long')})
		content: string;


	@ForeignKey(() => BlogArticleRevision)
	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		previous_revision_id: string;
	@HasOne(() => BlogArticleRevision, 'revision_previous_revision_id')
		previous_revision: BlogArticleRevision;


	@HasOne(() => BlogArticle, 'article_current_revision_id')
		revision_corresponding_article: BlogArticle;
}
