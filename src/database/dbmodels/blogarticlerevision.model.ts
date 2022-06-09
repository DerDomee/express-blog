import {
	Table,
	Column,
	Model,
	DataType,
	HasOne,
	PrimaryKey,
	ForeignKey,
	AllowNull} from 'sequelize-typescript';
import BlogArticle from './blogarticle.model';

@Table
/**
 *
 */
export default class BlogArticleRevision extends Model {
	@PrimaryKey
	@Column({
		type: DataType.STRING})
		blogarticlerevision_id: string;

	@Column({
		type: DataType.DATE})
		datetime: Date;

	@Column({
		type: DataType.TEXT('long')})
		content: any;


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
