import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { TagRepository } from './tag.repository';

@Module({
  imports: [LocalesModule],
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
  exports: [TagsService, TagRepository],
})
export class TagsModule {}
