import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Content',
    description: 'Content of the comment',
  })
  @IsString()
  @Length(1, 5000)
  content: string;
}
