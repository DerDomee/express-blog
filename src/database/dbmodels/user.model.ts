import {
	Table,
	Column,
	Model,
	DataType,
	HasMany,
	Default,
	BelongsToMany,
	PrimaryKey,
	AllowNull} from 'sequelize-typescript';
import Group from './group.model';
import LoginSession from './loginsession.model';
import Permission from './permission.model';
import UserPermission from './userpermission.model';
import UserGroup from './usergroup.model';
import {DataTypes} from 'sequelize';

@Table
/**
 *
 */
export default class User extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		user_id: string;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		username: string;

	@AllowNull(false)
	@Default(DataTypes.NOW)
	@Column({
		type: DataType.DATE})
		creation_time: Date;

	@AllowNull(false)
	@Default(true)
	@Column({
		type: DataType.BOOLEAN})
		disabled: boolean;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		password_hash: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		email: string;

	@BelongsToMany(() => Group, () => UserGroup)
		groups: Group[];

	@BelongsToMany(() => Permission, () => UserPermission)
		permissions: Permission[];

	@HasMany(() => LoginSession)
		sessions: LoginSession;
};
