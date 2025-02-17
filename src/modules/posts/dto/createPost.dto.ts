import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';
import { EPostStatus } from 'src/utils/enums';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Blog Post',
    description: 'Title of the post',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  title: string;

  @ApiProperty({
    example: 'my-first-blog-post',
    description: 'Slug for the post',
    uniqueItems: true,
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  slug?: string | null;

  @ApiPropertyOptional({
    example: 'My First Blog SEO Title',
    description: 'SEO title for the post',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  seoTitle?: string | null;

  @ApiPropertyOptional({
    example: 'This is a short description for SEO purposes.',
    description: 'SEO description for the post',
  })
  @IsOptional()
  @IsString()
  @Length(3, 512)
  seoDescription?: string | null;

  @ApiProperty({
    example: 'This is the content of the post.',
    description: 'Main content of the post',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'draft',
    description: 'Status of the post',
    enum: EPostStatus,
  })
  @IsEnum(EPostStatus)
  status: EPostStatus;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID of the category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    example: [
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
    ],
    description: 'List of tag IDs',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  tagIds?: string[] | null;
}
