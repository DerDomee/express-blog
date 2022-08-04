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
		sessions: LoginSession[];

	getCumulatedPermissions = async (): Promise<Permission[]> => {
		let allPermissions: Permission[] = await this.$get('permissions');
		(await this.$get('groups')).forEach(async (group) => {
			const groupPerms = (await group.$get('permissions')) as Permission[];
			allPermissions = [...allPermissions, ...groupPerms];
		});
		return allPermissions;
	};

	/**
	 *
	 * @param {string} requestedPermission Permission name to check
	 * @return {boolean} If the user has the requested permission
	 */
	hasPermission = async (requestedPermission: string): Promise<boolean> => {
		const allPermissions = await this.getCumulatedPermissions();
		return allPermissions.find(
			(permission) => {
				if (requestedPermission.trim() == permission.name.trim()) return true;
				const checkedPermissionName = permission.name.trim().split('.');
				const requestedPermissionName = requestedPermission.trim().split('.');
				while (requestedPermissionName.length > 0) {
					requestedPermissionName.pop();
					requestedPermissionName.push('*');
					if (
						JSON.stringify(requestedPermissionName) ===
						JSON.stringify(checkedPermissionName)) return true;
					requestedPermissionName.pop();
				}
				return false;
			},
		) ? true : false;
	};
};
