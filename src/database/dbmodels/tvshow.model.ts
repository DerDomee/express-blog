import {
	Table,
	Column,
	Model,
	DataType,
	Default,
	PrimaryKey,
	AllowNull,
	Unique,
	HasMany} from 'sequelize-typescript';
import TvSeason from './tvseason.model';


@Table
/**
 *
 */
export default class TvShow extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUID})
		tvShowId: string;

	@AllowNull(false)
	@Unique
	@Column({
		type: DataType.STRING})
		name: string;

	@AllowNull(false)
	@Unique
	@Column({
		type: DataType.STRING})
		description: string;

	@AllowNull(false)
	@Column({
		type: DataType.DATE})
		first_produced: Date;

	@AllowNull(true)
	@Column({
		type: DataType.DATE})
		last_produced: Date;

	@HasMany(() => TvSeason)
		seasons: TvSeason[];
}
