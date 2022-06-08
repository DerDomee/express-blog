import {
	Table,
	Column,
	Model,
	DataType,
	BelongsTo,
	PrimaryKey,
	ForeignKey} from 'sequelize-typescript';
import User from './user.model';


@Table
/**
 *
 */
export default class LoginSession extends Model {
	@PrimaryKey
	@Column({
		type: DataType.STRING})
		session_cookie: String;

	@Column({
		type: DataType.DATE})
		session_created_datetime: Date;

	@Column({
		type: DataType.DATE})
		session_expires_datetime: Date;

	@Column({
		type: DataType.BOOLEAN})
		session_is_persistent: boolean;

	@Column({
		type: DataType.DATE})
		session_lastused_datetime: Date;

	@Column({
		type: DataType.STRING})
		session_original_useragent: string;

	@Column({
		type: DataType.STRING})
		session_current_useragent: string;

	@Column({
		type: DataType.STRING})
		session_original_ip: string;

	@Column({
		type: DataType.STRING})
		session_current_ip: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.STRING})
		session_user_id: string;

	@BelongsTo(() => User)
		session_user: User;
};
