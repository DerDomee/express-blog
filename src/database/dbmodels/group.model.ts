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
		type: DataType.UUID})
		group_id: string;

	@Column({
		type: DataType.STRING})
		name: string;

	@BelongsToMany(() => User, () => UserGroup)
		users: User[];

	@BelongsToMany(() => Permission, () => GroupPermission)
		permissions: Permission[];

	getGroupPermissions = async (): Promise<Permission[]> => {
		return this.$get('permissions');
	};
}
