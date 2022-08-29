import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey} from 'sequelize-typescript';
import Group from './group.model';
import User from './user.model';

@Table
/**
 *
 */
export default class UserGroup extends Model {
	@ForeignKey(() => User)
	@Column({
		type: DataType.STRING})
		permission_id: string;

	@ForeignKey(() => Group)
	@Column({
		type: DataType.STRING})
		user_id: string;
}
