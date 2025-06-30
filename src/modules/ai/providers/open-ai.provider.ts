import { Injectable } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface';
import OpenAI from 'openai';
import {
  POST_CONTENT_KEY,
  PROMPT_GENERATE_BLOG_DESCRIPTION,
} from 'src/utils/constants';

@Injectable()
export class OpenAiProvider implements AiProvider {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSeoContent(postText: string): Promise<string> {
    return '';
  }

  async generateBlogDescription(postText: string): Promise<string> {
    const res = await this.client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: PROMPT_GENERATE_BLOG_DESCRIPTION.replace(
            POST_CONTENT_KEY,
            postText,
          ),
        },
      ],
    });

    return res.output_text;
  }
}
