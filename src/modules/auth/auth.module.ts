import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from '../session/session.module';
import { JwtStrategy } from './strategies/jwtStrategy';
import { JwtRefreshStrategy } from './strategies/jwtRefreshStrategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UserProvidersModule } from '../user-providers/user-providers.module';

@Module({
  imports: [
    UsersModule,
    LocalesModule,
    JwtModule.register({}),
    SessionModule,
    UserProvidersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
