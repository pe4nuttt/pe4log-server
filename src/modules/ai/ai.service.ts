import { Injectable } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { GenerateContentDto } from './dto/generate-content.dto';
import { parseHtmlContent } from 'src/utils/html-parser';
import {
  POST_CONTENT_KEY,
  PROMPT_GENERATE_BLOG_DESCRIPTION,
} from 'src/utils/constants';

@Injectable()
export class AiService {
  constructor(private aiProviderFactory: AiProviderFactory) {}

  async generateBlogDescription({ htmlContent, provider }: GenerateContentDto) {
    const ai = this.aiProviderFactory.getProvider(provider);
    return ai.generateBlogDescription(htmlContent);
  }

  async generateSeoContent({ htmlContent, provider }: GenerateContentDto) {
    const ai = this.aiProviderFactory.getProvider(provider);
    const postText = parseHtmlContent(htmlContent);
    return ai.generateSeoContent(postText);
  }
}
