import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';

@Module({
  imports: [LocalesModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
