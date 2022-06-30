import {
	Table,
	Column,
	Model,
	DataType,
	Default,
	PrimaryKey,
	AllowNull,
	BelongsTo,
	ForeignKey} from 'sequelize-typescript';
import TvSeason from './tvseason.model';
import TvShow from './tvshow.model';


@Table
/**
 *
 */
export default class TvEpisode extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		episodeId: String;

	@AllowNull(false)
	@Column({
		type: DataType.INTEGER})
		episodeNumberInSeason: number;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		name: String;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		slug: String;

	@AllowNull(false)
	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE})
		firstAired: Date;

	@ForeignKey(() => TvSeason)
		tvSeasonId: String;

	@ForeignKey(() => TvShow)
		tvShowId: String;

	@BelongsTo(() => TvSeason)
		tvSeason: TvSeason;

	@BelongsTo(() => TvShow)
		tvShow: TvShow;
};
