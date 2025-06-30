import { Exclude } from 'class-transformer';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { LoginAttempt } from 'src/modules/login-attempts/entities/login-attempt.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { UserProvider } from 'src/modules/user-providers/entities/user-provider.entity';
import { EUserAuthProvider, EUserRole, EUserStatus } from 'src/utils/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ length: 255, unique: true })
  username: string;

  // @Column({
  //   type: 'enum',
  //   enum: EUserAuthProvider,
  //   default: EUserAuthProvider.EMAIL,
  // })
  // authProvider: EUserAuthProvider;

  // @Column({ length: 255, nullable: true })
  // authProviderId?: string | null;
  @Column({
    type: 'enum',
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: EUserRole;

  @Column({
    type: 'enum',
    enum: EUserStatus,
    default: EUserStatus.ACTIVE,
  })
  status?: EUserStatus = EUserStatus.ACTIVE;

  @Column({ type: 'text', nullable: true })
  profilePicture?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[] | null;

  @OneToMany(() => LoginAttempt, (loginAttempt) => loginAttempt.user)
  loginAttempts?: LoginAttempt[] | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[] | null;

  @OneToMany(() => UserProvider, (userProvider) => userProvider.user)
  userProviders?: UserProvider[] | null;
}
