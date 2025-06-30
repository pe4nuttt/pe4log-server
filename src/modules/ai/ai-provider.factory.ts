import { Injectable } from '@nestjs/common';
import { OpenAiProvider } from './providers/open-ai.provider';
import { EAiProvider } from 'src/utils/enums';
import { GeminiProvider } from './providers/gemini.provider';

@Injectable()
export class AiProviderFactory {
  constructor(
    private readonly openAiProvider: OpenAiProvider,
    private readonly geminiProvider: GeminiProvider,
  ) {}

  getProvider(providerName: EAiProvider = EAiProvider.OPENAI) {
    if (providerName === EAiProvider.OPENAI) {
      return this.openAiProvider;
    } else if (providerName === EAiProvider.GEMINI) {
      return this.geminiProvider;
    } else {
      throw new Error(`Unsupported provider: ${providerName}`);
    }
  }
}
