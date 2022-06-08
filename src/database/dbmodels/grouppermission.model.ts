import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey} from 'sequelize-typescript';
import Group from './group.model';
import Permission from './permission.model';

@Table
/**
 *
 */
export default class GroupPermission extends Model {
	@ForeignKey(() => Group)
	@Column({
		type: DataType.STRING})
		userpermission_user_id: string;

	@ForeignKey(() => Permission)
	@Column({
		type: DataType.STRING})
		userpermission_permission_id: string;
};
