import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { EUserAuthProvider } from 'src/utils/enums';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: EUserAuthProvider,
    default: 'email',
  })
  authProvider: EUserAuthProvider;

  @Column({ length: 255, nullable: true })
  authProviderId?: string | null;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: 'admin' | 'user';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[] | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[] | null;
}
