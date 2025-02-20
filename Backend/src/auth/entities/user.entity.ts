import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  handle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  image: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  links: string[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken!: RefreshToken;
}
