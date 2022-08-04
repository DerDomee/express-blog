import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	Default,
	AllowNull} from 'sequelize-typescript';
import {
} from 'sequelize';

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
		image_id: String;

	@AllowNull(false)
	@Column({
		type: DataType.BLOB('medium')})
		data: BinaryData;

	@AllowNull(false)
	@Column({
		type: DataType.INTEGER})
		data_length: number;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		mime_type: string;

	@AllowNull(false)
	@Column({
		type: DataType.STRING})
		extension: string;
};
