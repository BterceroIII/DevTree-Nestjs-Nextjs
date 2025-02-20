import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column('varchar')
  refreshToken!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  user!: User;
}
