import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'UserLogs' })
export class UserLogs extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  userId: string;

  @Column(DataType.DATE)
  loginTime: Date;

  @Column({ allowNull: true })
  mostFrequentTime?: string;
}
