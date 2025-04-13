import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { EPostStatus } from 'src/utils/enums';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    example: '2025-01-01 00:00:00',
    description: 'Date and time when the post will be published',
  })
  @ValidateIf((obj) => obj.status === EPostStatus.PUBLISHED)
  @IsNotEmpty()
  @IsDateString()
  publishedAt?: Date | null;
}
