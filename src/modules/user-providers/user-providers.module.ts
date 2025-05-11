import { Module } from '@nestjs/common';
import { UserProvidersService } from './user-providers.service';
import { UserProvidersController } from './user-providers.controller';
import { UserProviderRepository } from './user-provider.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';

@Module({
  imports: [LocalesModule],
  controllers: [UserProvidersController],
  providers: [UserProvidersService, UserProviderRepository],
  exports: [UserProvidersService],
})
export class UserProvidersModule {}
