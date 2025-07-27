import { Comment } from 'src/modules/comments/entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ECommentReactionType } from 'src/utils/enums/';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment-reactions')
@Index(['user', 'comment'], {
  unique: true,
})
@Index('idx_comment_id', ['comment'])
export class CommentReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.commentReactions, { eager: true })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.commentReactions, {
    eager: false,
  })
  comment: Comment;

  @Column({
    type: 'enum',
    enum: ECommentReactionType,
    default: null,
    nullable: true,
  })
  type?: ECommentReactionType | null = null;
}
