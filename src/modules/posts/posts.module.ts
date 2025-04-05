import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './post.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [LocalesModule, TagsModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService, PostRepository],
})
export class PostsModule {}
