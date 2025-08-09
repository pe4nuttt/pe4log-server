import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { SubscribeNewsLetterDto } from './dto/subscribe-newsletter.dto';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/services/redis/redis.service';
import {
  SUBSCRIPTION_EMAIL_EXPIRATION,
  SUBSCRIPTION_EMAIL_KEY_CONFIRMED_PREFIX,
  SUBSCRIPTION_EMAIL_KEY_PREFIX,
} from 'src/utils/constants';
import { LocalesService } from 'src/services/i18n/i18n.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Get()
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(+id);
  }

  @Post('subscription')
  async subscribeNewsletter(
    @Body() subscribeNewsletterDto: SubscribeNewsLetterDto,
  ) {
    try {
      const uid = uuidv4();
      await this.redisService.set(
        `${SUBSCRIPTION_EMAIL_KEY_PREFIX}${uid}`,
        subscribeNewsletterDto.email,
        SUBSCRIPTION_EMAIL_EXPIRATION,
      );

      await this.newsletterService.subscribeNewsletter(
        subscribeNewsletterDto.email,
      );

      await this.mailService.sendUserSubscribeNewsletter(
        subscribeNewsletterDto.email,
        uid,
      );

      return {
        message: this.localesService.translate(
          'message.subscription.sendSubscriptionNewsletterSuccess',
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        this.localesService.translate(
          'message.subscription.sendSubscriptionNewsletterFailed',
        ),
      );
    }
  }

  @Post('confirm-subscription/:uid')
  async confirmSubscription(@Param('uid') uid: string) {
    try {
      const email = await this.redisService.get(
        `${SUBSCRIPTION_EMAIL_KEY_PREFIX}${uid}`,
      );

      if (!email) {
        const confirmedEmail = await this.redisService.get(
          `${SUBSCRIPTION_EMAIL_KEY_CONFIRMED_PREFIX}${uid}`,
        );

        if (!confirmedEmail)
          throw new InternalServerErrorException(
            this.localesService.translate(
              'message.subscription.confirmSubscriptionFailed',
            ),
          );

        return {
          message: this.localesService.translate(
            'message.subscription.confirmSubscriptionSuccess',
          ),
        };
      }

      await this.newsletterService.confirmSubscriptionNewsletter(email);
      await this.redisService.del(`${SUBSCRIPTION_EMAIL_KEY_PREFIX}${uid}`);

      await this.redisService.set(
        `${SUBSCRIPTION_EMAIL_KEY_CONFIRMED_PREFIX}${uid}`,
        email,
      );

      return {
        message: this.localesService.translate(
          'message.subscription.confirmSubscriptionSuccess',
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        this.localesService.translate(
          'message.subscription.confirmSubscriptionFailed',
        ),
      );
    }
  }
}
