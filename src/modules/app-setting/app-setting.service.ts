import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AppSettingRepository } from './app-setting.repository';
import { APP_SETTINGS_KEYS, QUEUE_KEY } from 'src/utils/constants';
import { INewsletterSettings } from 'src/utils/interfaces';
import { AllConfigType } from 'src/config/configuration.config';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import dayjs from 'dayjs';

@Injectable()
export class AppSettingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppSettingService.name);

  constructor(
    private readonly appSettingRepository: AppSettingRepository,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectQueue(QUEUE_KEY.SEND_NEWSLETTER)
    private readonly sendNewsletterQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    const newsletterSetting = await this.appSettingRepository.findOne({
      where: {
        key: APP_SETTINGS_KEYS.NEWSLETTER,
      },
    });

    if (!newsletterSetting) {
      const value: INewsletterSettings = {
        timezone:
          this.configService.getOrThrow('appSetting.newsletter.timezone', {
            infer: true,
          }) || 'Asia/Ho_Chi_Minh',
        time:
          this.configService.getOrThrow('appSetting.newsletter.time', {
            infer: true,
          }) || '08:00',
        enabled: true,
      };

      await this.appSettingRepository.save({
        key: APP_SETTINGS_KEYS.NEWSLETTER,
        value,
      });
    }

    await this.scheduleNewsletter();
  }

  async scheduleNewsletter() {
    const newsletterSetting = await this.appSettingRepository.findOne({
      where: {
        key: APP_SETTINGS_KEYS.NEWSLETTER,
      },
    });

    if (!newsletterSetting.value?.enabled) return;

    const { timezone, time } = newsletterSetting.value as INewsletterSettings;

    const [hour, minute] = time.split(':').map(Number);

    const dt = dayjs().hour(hour).minute(minute).second(0).tz(timezone);

    // const utcHour = dt.utc().hour();
    // const utcMinute = dt.utc().minute();

    const cronExpr = `0 ${dt.minute()} ${dt.hour()} * * *`;

    this.logger.log(
      `Scheduling newsletter job with cron expression: ${cronExpr} and timezone: ${timezone}`,
    );

    const sendNewsletterJob = await this.sendNewsletterQueue.upsertJobScheduler(
      'send-newsletter',
      {
        pattern: cronExpr,
        tz: timezone,
      },
    );

    this.logger.log(
      `Newsletter job scheduled with ID: ${sendNewsletterJob.id} with cron expression: ${cronExpr} and timezone: ${timezone}`,
    );
  }
}
