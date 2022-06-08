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
		user_username: string;

	@AllowNull(false)
	@Default(DataTypes.DATE)
	@Column({
		type: DataType.DATE})
		user_creation_time: Date;

	@AllowNull(false)
	@Default(true)
	@Column({
		type: DataType.BOOLEAN})
		user_disabled: boolean;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		user_password_hash: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		user_email: string;

	@BelongsToMany(() => Group, () => UserGroup)
		user_groups: Group[];

	@BelongsToMany(() => Permission, () => UserPermission)
		user_permissions: Permission[];

	@HasMany(() => LoginSession)
		user_sessions: LoginSession;
};
