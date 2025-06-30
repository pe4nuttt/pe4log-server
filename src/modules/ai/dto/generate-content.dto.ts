import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EAiProvider } from 'src/utils/enums';

export class GenerateContentDto {
  @ApiProperty({
    example: '<div>Hello</div>',
    description: 'Html content of the post',
  })
  @IsString()
  htmlContent: string;

  @ApiProperty({
    example: EAiProvider.OPENAI,
    description: 'AI Provider to use',
    enum: EAiProvider,
  })
  @IsOptional()
  @IsEnum(EAiProvider)
  provider?: EAiProvider = EAiProvider.OPENAI;
}
