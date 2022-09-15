import {
	Table,
	Column,
	Model,
	DataType,
	BelongsTo,
	PrimaryKey,
	ForeignKey,
	Default,
	AllowNull} from 'sequelize-typescript';
import User from './user.model';


@Table
/**
 *
 */
export default class LoginSession extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Column({
		type: DataType.STRING(256)})
		session_cookie: string;

	@Default(DataType.NOW)
	@AllowNull(false)
	@Column({
		type: DataType.DATE})
		created_datetime: Date;

	@AllowNull(false)
	@Column({
		type: DataType.DATE})
		expires_datetime: Date;

	@AllowNull(false)
	@Default(false)
	@Column({
		type: DataType.BOOLEAN})
		is_persistent: boolean;

	@AllowNull(false)
	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE})
		lastused_datetime: Date;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		original_useragent: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		current_useragent: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		original_ip: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		current_ip: string;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID})
		user_id: string;

	@BelongsTo(() => User)
		user: User;
}
