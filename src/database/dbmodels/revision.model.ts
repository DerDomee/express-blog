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
export default class Revision extends Model {
	@PrimaryKey
	@Column({
		type: DataType.STRING})
		revision_id: string;

	@Column({
		type: DataType.DATE})
		revision_datetime: Date;

	@Column({
		type: DataType.TEXT('long')})
		revision_content: any;


	@ForeignKey(() => Revision)
	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		revision_previous_revision_id: string;
	@HasOne(() => Revision, 'revision_previous_revision_id')
		revision_previous_revision: Revision;


	@HasOne(() => BlogArticle, 'article_current_revision_id')
		revision_corresponding_article: BlogArticle;
}
