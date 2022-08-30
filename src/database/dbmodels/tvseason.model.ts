import {
	Table,
	Column,
	Model,
	DataType,
	BelongsTo,
	Default,
	PrimaryKey,
	AllowNull,
	HasMany,
	ForeignKey} from 'sequelize-typescript';
import TvEpisode from './tvepisode.model';
import TvShow from './tvshow.model';


@Table
/**
 *
 */
export default class TvSeason extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		seasonId: string;

	@AllowNull(false)
	@Column({
		type: DataType.INTEGER})
		seasonNumberInShow: number;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		name: string;

	@ForeignKey(() => TvShow)
		tvShowId: string;

	@BelongsTo(() => TvShow)
		tvShow: TvShow;

	@HasMany(() => TvEpisode)
		episodes: TvEpisode[];
}
