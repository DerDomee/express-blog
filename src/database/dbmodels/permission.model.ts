import {
	Table,
	Column,
	Model,
	DataType,
	BelongsToMany,
	Default,
	PrimaryKey,
	AllowNull,
	Unique} from 'sequelize-typescript';
import Group from './group.model';
import GroupPermission from './grouppermission.model';
import User from './user.model';
import UserPermission from './userpermission.model';


@Table
/**
 *
 */
export default class Permission extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Default(DataType.UUIDV4)
	@Column({
		type: DataType.UUIDV4})
		permission_id: string;

	@AllowNull(false)
	@Unique
	@Column({
		type: DataType.STRING})
		name: string;

	@AllowNull(true)
	@Column({
		type: DataType.STRING})
		description: string;

	@BelongsToMany(() => Group, () => GroupPermission)
		groups: Group[];

	@BelongsToMany(() => User, () => UserPermission)
		users: User[];
}
