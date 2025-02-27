import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

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
    example: '#ffffff',
    description: 'Color of the tag',
  })
  @IsOptional()
  @IsString()
  @Length(7)
  color?: string;
}
