import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AllConfigType } from 'src/config/configuration.config';
import { IJwtPayload } from '../interfaces/jwtPayload.interface';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.secret', {
        infer: true,
      }),
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionService.findById(payload.sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    return payload;
  }
}
