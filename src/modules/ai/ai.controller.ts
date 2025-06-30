import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-blog-description')
  async generateBlogDescription(
    @Body() generateContentDto: GenerateContentDto,
  ) {
    const data =
      await this.aiService.generateBlogDescription(generateContentDto);

    return {
      data,
    };
  }

  @Post('generate-seo-content')
  async generateSeoContent(@Body() generateContentDto: GenerateContentDto) {
    const data = await this.aiService.generateSeoContent(generateContentDto);

    return {
      data,
    };
  }
}
