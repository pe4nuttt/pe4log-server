import { CommentReaction } from 'src/modules/comment-reactions/entities/comment-reaction.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity('comments')
@Index('idx_comment_slug_path', ['post.slug', 'path'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'postSlug',
    referencedColumnName: 'slug',
    foreignKeyConstraintName: 'FK_comment_post_slug',
  })
  post: Post;

  @OneToMany(
    () => CommentReaction,
    (commentReaction) => commentReaction.comment,
    {
      eager: false,
    },
  )
  commentReactions?: CommentReaction[] | null;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'int' })
  depth: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
