import { Exclude } from 'class-transformer';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { EUserAuthProvider } from 'src/utils/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class UserProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EUserAuthProvider,
    // default: EUserAuthProvider.EMAIL,
  })
  authProvider: EUserAuthProvider;

  @Column({ length: 255, nullable: true })
  authProviderId?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ManyToOne(() => User, (user) => user.userProviders, { eager: true })
  user: User;
}
