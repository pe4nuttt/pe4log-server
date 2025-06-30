import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AllConfigType } from 'src/config/configuration.config';
import { IRefreshTokenPayload } from '../interfaces/jwtPayload.interface';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  async validate(payload: IRefreshTokenPayload) {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionService.findById(payload.sessionId);

    if (!session || session.hash !== payload.hash) {
      throw new UnauthorizedException('Invalid session');
    }

    return payload;
  }
}
