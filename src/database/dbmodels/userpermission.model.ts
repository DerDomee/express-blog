import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey} from 'sequelize-typescript';
import Permission from './permission.model';
import User from './user.model';

@Table
/**
 *
 */
export default class UserPermission extends Model {
	@ForeignKey(() => User)
	@Column({
		type: DataType.STRING})
		user_id: string;

	@ForeignKey(() => Permission)
	@Column({
		type: DataType.STRING})
		permission_id: string;
};
