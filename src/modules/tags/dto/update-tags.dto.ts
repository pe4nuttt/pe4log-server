import { PartialType } from '@nestjs/swagger';
import { CreateTagsDto } from './create-tags.dto';

export class UpdateTagsDto extends PartialType(CreateTagsDto) {}
