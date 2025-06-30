import { Injectable } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface';
import { GoogleGenAI } from '@google/genai';
import {
  GEMINI_PROMPT_GENERATE_BLOG_DESCRIPTION,
  GEMINI_PROMPT_GENERATE_SEO_CONTENT,
  POST_CONTENT_KEY,
  PROMPT_GENERATE_BLOG_DESCRIPTION,
} from 'src/utils/constants';

@Injectable()
export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateSeoContent(postText: string): Promise<string> {
    const content = GEMINI_PROMPT_GENERATE_SEO_CONTENT.replace(
      POST_CONTENT_KEY,
      postText,
    );

    const res = await this.client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: content,
    });

    return res.text;
  }

  async generateBlogDescription(postText: string): Promise<string> {
    const content = GEMINI_PROMPT_GENERATE_BLOG_DESCRIPTION.replace(
      POST_CONTENT_KEY,
      postText,
    );

    const res = await this.client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: content,
    });

    return res.text;
  }
}
