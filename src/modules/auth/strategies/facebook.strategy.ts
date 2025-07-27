import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AllConfigType } from 'src/config/configuration.config';
import { ISocialUserData } from '../interfaces/social.interface';
import { EUserAuthProvider } from 'src/utils/enums';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.getOrThrow('authFacebook.clientId', {
        infer: true,
      }),
      clientSecret: configService.getOrThrow('authFacebook.clientSecret', {
        infer: true,
      }),
      callbackURL: configService.getOrThrow('authFacebook.callbackUrl', {
        infer: true,
      }),
      scope: ['email'],
      profileFields: ['id', 'email', 'gender', 'name', 'verified', 'picture'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    try {
      const { id, emails, name, photos, displayName, username } = profile;

      const user: ISocialUserData = {
        socialId: id,
        email: emails?.[0]?.value,
        firstName: name.givenName,
        lastName: name.familyName,
        image: photos?.[0]?.value,
        provider: EUserAuthProvider.GITHUB,
      };
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
