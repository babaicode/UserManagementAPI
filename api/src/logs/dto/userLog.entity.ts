import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Table({ tableName: 'UserLogs' })
export class UserLogs extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  @Field()
  id: number;

  @Column
  @Field()
  userId: string;

  @Column(DataType.DATE)
  @Field()
  loginTime: Date;

  @Column({ allowNull: true })
  @Field({ nullable: true })
  mostFrequentTime?: string;
}
