import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [UsersModule, LocalesModule, JwtModule.register({}), SessionModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
