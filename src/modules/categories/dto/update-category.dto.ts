import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Sport & Activity',
    description: 'Name of the category',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    example: 'sport-activity',
    description: 'Slug of the category',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  slug: string;
}
