import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserLogs')
export class UserLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  loginTime: string;

  @Column()
  mostFrequentTime: string;
}
