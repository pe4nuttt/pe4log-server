import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentRepository } from './comment.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';

@Module({
  providers: [CommentsService, CommentRepository],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [LocalesModule],
})
export class CommentsModule {}
