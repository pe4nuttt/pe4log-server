import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { RedisModule } from 'src/services/redis/redis.module';
import { MailModule } from '../mail/mail.module';
import { NewsletterRepository } from './newsletter.repository';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository],
  imports: [RedisModule, MailModule],
})
export class NewsletterModule {}
