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
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';


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
		episodeId: string;

	@AllowNull(false)
	@Column({
		type: DataType.INTEGER})
		episodeNumberInSeason: number;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		name: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		slug: string;

	@AllowNull(false)
	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE})
		firstAired: Date;

	@ForeignKey(() => TvSeason)
		tvSeasonId: string;

	@ForeignKey(() => TvShow)
		tvShowId: string;

	@BelongsTo(() => TvSeason)
		tvSeason: TvSeason;

	@BelongsTo(() => TvShow)
		tvShow: TvShow;

	getVideoLength = async () => {
		try {
			const videoMeta = await ffprobe(`./data/videos/${this.episodeId}.mp4`,
				{path: ffprobeStatic.path});
			return Math.ceil(videoMeta.streams[0].duration / 60) || null;
		} catch (err) {
			return null;
		}
	};
	@Column({
		type: DataType.VIRTUAL})
		videoLength: number;
}
