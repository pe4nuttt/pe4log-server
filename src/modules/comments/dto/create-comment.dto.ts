import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Content',
    description: 'Content of the comment',
  })
  @IsString()
  @Length(1, 5000)
  content: string;

  @ApiProperty({
    example: 'welcome-to-my-blog',
    description: 'Post slug',
  })
  @IsString()
  postSlug: string;

  @ApiProperty({
    example: '1',
    description: "Parent's id",
  })
  @IsOptional()
  @IsInt()
  parentId?: number | null;
}
