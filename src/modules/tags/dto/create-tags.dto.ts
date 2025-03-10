import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { SLUG_REGEX } from 'src/utils/constants';

export class CreateTagsDto {
  @ApiProperty({
    example: 'Tag name',
    description: 'Name of the tag',
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

  @ApiProperty({
    example: '#ffffff',
    description: 'Color of the tag',
  })
  @IsOptional()
  @IsString()
  @Length(7)
  color?: string;
}
