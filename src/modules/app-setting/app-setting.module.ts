import { Module } from '@nestjs/common';
import { AppSettingService } from './app-setting.service';
import { AppSettingController } from './app-setting.controller';
import { AppSettingRepository } from './app-setting.repository';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_KEY } from 'src/utils/constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_KEY.SEND_NEWSLETTER,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_KEY.SEND_NEWSLETTER,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AppSettingController],
  providers: [AppSettingService, AppSettingRepository],
})
export class AppSettingModule {}
