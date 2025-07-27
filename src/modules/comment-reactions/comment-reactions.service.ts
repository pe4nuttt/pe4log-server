import { Injectable, NotFoundException } from '@nestjs/common';
import { ECommentReactionType } from 'src/utils/enums/';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from '../users/users.service';
import { CommentReactionRepository } from './comment-reaction.repository';

@Injectable()
export class CommentReactionsService {
  constructor(
    private readonly commentReactionRepo: CommentReactionRepository,
    private readonly commentService: CommentsService,
    private readonly userService: UsersService,
  ) {}

  async react(commentId: number, userId: number, type: ECommentReactionType) {
    const comment = await this.commentService.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    let reaction = await this.commentReactionRepo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });

    if (reaction) {
      // Toggle off if the same reaction is sent again
      if (reaction.type === type) {
        reaction.type = null;
      } else {
        reaction.type = type;
      }
      await this.commentReactionRepo.save(reaction);
    } else {
      reaction = this.commentReactionRepo.create({
        comment,
        user,
        type,
      });
      await this.commentReactionRepo.save(reaction);
    }

    // Count likes and dislikes for the comment
    const [likesCount, dislikesCount] = await Promise.all([
      this.commentReactionRepo.count({
        where: { comment: { id: commentId }, type: ECommentReactionType.LIKE },
      }),
      this.commentReactionRepo.count({
        where: {
          comment: { id: commentId },
          type: ECommentReactionType.DISLIKE,
        },
      }),
    ]);

    // Get the user's current reaction status
    const userLikeStatus = {
      isLiked: reaction.type === ECommentReactionType.LIKE,
      isDisliked: reaction.type === ECommentReactionType.DISLIKE,
    };

    return {
      likesCount,
      dislikesCount,
      userLikeStatus,
    };
  }
}
