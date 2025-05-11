import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import type { Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AllConfigType } from 'src/config/configuration.config';
import { ConfigService } from '@nestjs/config';
import { EUserAuthProvider } from 'src/utils/enums';
import { ISocialUserData } from '../interfaces/social.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.getOrThrow('authGoogle.clientId', {
        infer: true,
      }),
      clientSecret: configService.getOrThrow('authGoogle.clientSecret', {
        infer: true,
      }),
      callbackURL: configService.getOrThrow('authGoogle.callbackUrl', {
        infer: true,
      }),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user: ISocialUserData = {
      socialId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      image: photos[0].value,
      provider: EUserAuthProvider.GOOGLE,
      // accessToken,
      // refreshToken,
    };

    done(null, user);
  }
}
