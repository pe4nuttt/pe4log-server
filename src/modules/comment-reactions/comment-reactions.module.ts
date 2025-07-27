import { Module } from '@nestjs/common';
import { CommentReactionsService } from './comment-reactions.service';
import { CommentReactionsController } from './comment-reactions.controller';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { CommentReactionRepository } from './comment-reaction.repository';

@Module({
  controllers: [CommentReactionsController],
  providers: [CommentReactionsService, CommentReactionRepository],
  imports: [UsersModule, CommentsModule, LocalesModule],
})
export class CommentReactionsModule {}
