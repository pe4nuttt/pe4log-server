import { Comment } from 'src/modules/comments/entities/comment.entity';

export interface ICommentTreeNode extends Comment {
  children?: ICommentTreeNode[] | null;
  likesCount?: number;
  dislikesCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}
