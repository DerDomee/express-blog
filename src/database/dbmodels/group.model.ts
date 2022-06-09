import {
	Table,
	Column,
	Model,
	DataType,
	BelongsToMany,
	PrimaryKey,
	Default,
	AllowNull} from 'sequelize-typescript';
import GroupPermission from './grouppermission.model';
import Permission from './permission.model';
import User from './user.model';
import UserGroup from './usergroup.model';

@Table
/**
 *
 */
export default class Group extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		group_id: String;

	@Column({
		type: DataType.STRING})
		group_name: String;

	@BelongsToMany(() => User, () => UserGroup)
		group_users: User[];

	@BelongsToMany(() => Permission, () => GroupPermission)
		group_permissions: Permission[];
};