import { Module } from '@nestjs/common';
import { OpenAiProvider } from './providers/open-ai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AiProviderFactory } from './ai-provider.factory';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  providers: [OpenAiProvider, GeminiProvider, AiProviderFactory, AiService],
  exports: [AiProviderFactory],
  controllers: [AiController],
})
export class AiModule {}
