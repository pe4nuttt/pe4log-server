import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentReactionsService } from './comment-reactions.service';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { ECommentReactionType } from 'src/utils/enums';
import { IJwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { UserDecorator } from 'src/utils/decorators/user.decorator';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment-reactions')
export class CommentReactionsController {
  constructor(
    private readonly commentReactionsService: CommentReactionsService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':commentId/like')
  async like(
    @Param('commentId') commentId: number,
    @UserDecorator() user: IJwtPayload,
  ) {
    const userId = user.id;
    const data = await this.commentReactionsService.react(
      commentId,
      userId,
      ECommentReactionType.LIKE,
    );

    return {
      message: this.localesService.translate(
        data.userLikeStatus.isLiked
          ? 'message.comment.commentLiked'
          : 'message.comment.likeRemoved',
      ),
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':commentId/dislike')
  async dislike(
    @Param('commentId') commentId: number,
    @UserDecorator() user: IJwtPayload,
  ) {
    const userId = user.id;
    const data = await this.commentReactionsService.react(
      commentId,
      userId,
      ECommentReactionType.DISLIKE,
    );

    return {
      message: this.localesService.translate(
        data.userLikeStatus.isDisliked
          ? 'message.comment.commentDisliked'
          : 'message.comment.dislikeRemoved',
      ),
      data,
    };
  }
}
