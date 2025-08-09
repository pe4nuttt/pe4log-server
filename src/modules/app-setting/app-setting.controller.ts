import { Controller } from '@nestjs/common';
import { AppSettingService } from './app-setting.service';

@Controller('app-setting')
export class AppSettingController {
  constructor(private readonly appSettingService: AppSettingService) {}
}
