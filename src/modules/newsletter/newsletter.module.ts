import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { RedisModule } from 'src/services/redis/redis.module';
import { MailModule } from '../mail/mail.module';
import { NewsletterRepository } from './newsletter.repository';
import { SendNewsletterProcessor } from './queues/newsletter.processor';
import { PostsModule } from '../posts/posts.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_KEY } from 'src/utils/constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository, SendNewsletterProcessor],
  imports: [
    RedisModule,
    MailModule,
    PostsModule,
    BullModule.registerQueue({
      name: QUEUE_KEY.SEND_NEWSLETTER,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_KEY.SEND_NEWSLETTER,
      adapter: BullMQAdapter,
    }),
  ],
})
export class NewsletterModule {}
