import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostHTMLDto {
  @ApiProperty({
    example: '<p>Content</p>',
    description: 'Post HTML content',
  })
  @IsOptional()
  @IsString()
  htmlContent?: string;
}
