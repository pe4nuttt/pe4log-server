import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './post.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { TagsModule } from '../tags/tags.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [LocalesModule, TagsModule, FilesModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
  exports: [PostsService, PostRepository],
})
export class PostsModule {}
