import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RedisService } from 'src/services/redis/redis.service';
import { SUBSCRIPTION_EMAIL_EXPIRATION } from 'src/utils/constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserSubscribeNewsletter(email: string, uid?: string) {
    try {
      const confirmUrl = `example.com/subscribe-newsletter?uid=${uid}`;

      await this.mailerService.sendMail({
        to: email,
        from: 'tienanh15@gmail.com',
        subject: 'Newsletter: Please Confirm your Subscription',
        template: './newsletter-confirmation',
        context: {
          email: email,
          confirmUrl,
        },
      });
    } catch (error) {
      console.log('[ERROR]', error);
    }
  }
}
