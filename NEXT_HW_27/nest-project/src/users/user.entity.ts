import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Board } from '../boards/board.entity';
import { UserProfile } from 'src/user_profile/user_profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.user, { cascade: true })
  boards: Board[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;
}
