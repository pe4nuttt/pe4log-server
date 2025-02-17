import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './post.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
})
export class PostsModule {}
