import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @Column({ unique: true })
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
