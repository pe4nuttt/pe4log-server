import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RedisService } from 'src/services/redis/redis.service';
import { SUBSCRIPTION_EMAIL_EXPIRATION } from 'src/utils/constants';
import { Post } from '../posts/entities/post.entity';
import { Newsletter } from '../newsletter/entities/newsletter.entity';
import { AllConfigType } from 'src/config/configuration.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async sendUserSubscribeNewsletter(email: string, uid?: string) {
    try {
      const confirmUrl = `${this.configService.getOrThrow(
        'appFrontend.domain',
        {
          infer: true,
        },
      )}/subscribe-newsletter?uid=${uid}`;

      await this.mailerService.sendMail({
        to: email,
        from: 'tienanh1512@gmail.com',
        subject: 'Newsletter: Please Confirm your Subscription',
        template: './newsletter-confirmation',
        context: {
          email: email,
          confirmUrl,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to send subscription confirmation email',
        error,
      );
    }
  }

  async sendNewsletterToUser(
    user: Newsletter,
    posts: Pick<Post, 'title' | 'slug' | 'coverImage' | 'publishedAt'>[],
  ) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'tienanh1512@gmail.com',
        subject: 'Pe4log Newsletter: Latest Posts',
        template: './newsletter-email',
        context: {
          user,
          posts,
          site: {
            name: 'Pe4log',
            tagline: '123',
          },
          socialLinks: [],
          unsubscribeUrl: '',
          preferencesUrl: '',
        },
      });
    } catch (error) {
      this.logger.error('Failed to send newsletter to users', error);
    }
  }
}
