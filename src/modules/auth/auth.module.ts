import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from '../session/session.module';
import { JwtStrategy } from './strategies/jwtStrategy';
import { JwtRefreshStrategy } from './strategies/jwtRefreshStrategy';

@Module({
  imports: [UsersModule, LocalesModule, JwtModule.register({}), SessionModule],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
