import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Category',
    description: 'Name of the category',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;
}
