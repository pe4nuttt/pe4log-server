import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AppSetting } from './entities/app-setting.entity';

@Injectable()
export class AppSettingRepository extends Repository<AppSetting> {
  constructor(private dataSource: DataSource) {
    super(AppSetting, dataSource.createEntityManager());
  }
}
