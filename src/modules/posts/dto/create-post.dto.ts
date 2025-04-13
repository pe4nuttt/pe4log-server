import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsArray,
  IsInt,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { EPostStatus } from 'src/utils/enums';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Blog Post',
    description: 'Title of the post',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 512)
  title: string;

  @ApiProperty({
    example: 'my-first-blog-post',
    description: 'Slug for the post',
    uniqueItems: true,
  })
  @IsOptional()
  @IsString()
  @Length(3, 512)
  slug?: string;

  @ApiProperty({
    example: 'My First Blog Post description',
    description: 'Description of the post',
  })
  @IsOptional()
  @IsString()
  @Length(3, 1000)
  description?: string;

  @ApiPropertyOptional({
    example: 'My First Blog SEO Title',
    description: 'SEO title for the post',
  })
  @IsOptional()
  @IsString()
  @Length(3, 512)
  seoTitle?: string;

  @ApiPropertyOptional({
    example: 'This is a short description for SEO purposes.',
    description: 'SEO description for the post',
  })
  @IsOptional()
  @IsString()
  @Length(3, 512)
  seoDescription?: string;

  // @ApiProperty({
  //   example: 'This is the content of the post.',
  //   description: 'Main content of the post',
  // })
  // @IsString()
  // content: string;

  @ApiProperty({
    example: 'draft',
    description: 'Status of the post',
    enum: EPostStatus,
  })
  @IsEnum(EPostStatus)
  status: EPostStatus;

  @ApiProperty({
    example: '2025-01-01 00:00:00',
    description: 'Date and time when the post will be published',
  })
  @ValidateIf((obj) => obj.status === EPostStatus.PUBLISHED)
  @IsNotEmpty()
  @IsDateString()
  publishedAt?: Date | null;

  @ApiProperty({
    example: 1,
    description: 'ID of the category',
  })
  @IsOptional()
  @IsInt()
  categoryId?: number | null;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'List of tag IDs',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[] | null;
}
