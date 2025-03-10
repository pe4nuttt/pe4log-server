import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { SLUG_REGEX } from 'src/utils/constants';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Sport activity',
    description: 'Name of the category',
  })
  @IsNotEmpty()
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
  @Matches(SLUG_REGEX, {
    message: 'Invalid slug',
  })
  slug: string;
}
