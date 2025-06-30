import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalesService } from 'src/services/i18n/i18n.service';
import * as bcrypt from 'bcrypt';
import { EUserAuthProvider, EUserRole } from 'src/utils/enums';
import { SignUpResponseDto } from './dto/signUpResponse.dto';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/configuration.config';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { Session } from '../session/entities/session.entity';
import { SessionService } from '../session/session.service';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { SignInDto } from './dto/signIn.dto';
import { SignInResponseDto } from './dto/signInResponse.dto';
import {
  IAccessTokenPayload,
  IJwtPayload,
  IRefreshTokenPayload,
} from './interfaces/jwtPayload.interface';
import { ISocialUserData } from './interfaces/social.interface';
import { NullableType } from 'src/utils/types';
import { UserProvidersService } from '../user-providers/user-providers.service';
import { Transactional } from 'typeorm-transactional';
import { hashPassword } from 'src/utils/auth';
import { LoginAttemptsService } from '../login-attempts/login-attempts.service';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;

  constructor(
    private readonly userService: UsersService,
    private readonly localesService: LocalesService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly userProviderService: UserProvidersService,
    private readonly loginAttemptsService: LoginAttemptsService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const isExistedUser = await this.userService.findByEmail(signUpDto.email);

      if (isExistedUser) {
        throw new ConflictException(
          this.localesService.translate(
            'message.validation.emailAlreadyExisted',
          ),
        );
      }

      const hashedPassword = await hashPassword(signUpDto.password);

      const user = await this.userService.create({
        ...signUpDto,
        password: hashedPassword,
        role: EUserRole.USER,
        // authProvider: EUserAuthProvider.EMAIL,
        username: `${signUpDto.email}.${Date.now()}`,
      });

      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');

      const session = await this.sessionService.create({
        user: user,
        hash,
      });

      const { accessToken, refreshToken, tokenExpires } =
        await this.getTokensData({
          id: user.id,
          role: user.role,
          email: user.email,
          sessionId: session.id,
          hash,
        });

      return {
        accessToken,
        refreshToken,
        tokenExpires,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(signInDto: SignInDto, ip?: string): Promise<SignInResponseDto> {
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException(
        this.localesService.translate('message.validation.emailNotFound'),
      );
    }

    // if (user.authProvider != EUserAuthProvider.EMAIL) {
    //   throw new UnprocessableEntityException(
    //     this.localesService.translate(
    //       'message.validation.needLoginViaEmailProvider',
    //     ),
    //   );
    // }

    if (!user.password)
      throw new UnprocessableEntityException(
        this.localesService.translate('message.validation.incorrectPassword'),
      );

    const isValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isValid) {
      this.loginAttemptsService.create({
        userId: user.id,
        isSuccessful: false,
        failureReason: 'Incorrect password',
        ip: ip,
      });

      throw new UnprocessableEntityException(
        this.localesService.translate('message.validation.incorrectPassword'),
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user: user,
      hash,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
        email: user.email,
        sessionId: session.id,
        hash,
      });

    this.loginAttemptsService.create({
      userId: user.id,
      isSuccessful: true,
      ip: ip,
    });

    return {
      accessToken,
      refreshToken,
      tokenExpires,
      user,
    };
  }

  async refreshToken(
    data: Pick<IJwtPayload, 'sessionId' | 'hash'>,
  ): Promise<Omit<SignInResponseDto, 'user'>> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.deletedAt || session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.userService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
        email: user.email,
        sessionId: session.id,
        hash,
      });

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }

  async signOut(data: Pick<IJwtPayload, 'sessionId'>) {
    await this.sessionService.deleteById(data.sessionId);
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    email: User['email'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const refreshTokenExpires = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn as ms.StringValue);
    const accessTokenPayload: IAccessTokenPayload = {
      id: data.id,
      role: data.role,
      email: data.email,
      sessionId: data.sessionId,
    };
    const refreshTokenPayload: IRefreshTokenPayload = {
      hash: data.hash,
      sessionId: data.sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: tokenExpiresIn,
        secret: this.configService.getOrThrow('auth.secret', {
          infer: true,
        }),
      }),
      await this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: refreshTokenExpires,
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }

  async me(userJwtPayload: IJwtPayload) {
    return this.userService.findById(userJwtPayload.id);
  }

  @Transactional()
  async validateSocialLogin(
    authProvider: EUserAuthProvider,
    socialData: ISocialUserData,
  ) {
    let user: NullableType<User> = null;
    const socialEmail = socialData.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.userService.findByEmail(socialEmail);
    }

    if (socialData.socialId) {
      user = await this.userService.findBySocialIdAndProvider(
        socialData.socialId,
        authProvider,
      );
    }

    if (user) {
      if (user && !userByEmail) {
        user.email = socialEmail;
        await this.userService.update(user.id, user);
      }
    } else if (userByEmail && socialData.socialId) {
      user = userByEmail;

      await this.userProviderService.create({
        userId: user.id,
        authProvider,
        authProviderId: socialData.socialId,
      });
    } else if (socialData.socialId) {
      user = await this.userService.create({
        email: socialEmail,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        password: null,
        role: EUserRole.USER,
        profilePicture: socialData.image,
        userProviders: [
          {
            authProvider,
            authProviderId: socialData.socialId,
          },
        ],
        username: `${socialData.email}.${Date.now()}`,
      } as User);

      await this.userProviderService.create({
        userId: user.id,
        authProvider,
        authProviderId: socialData.socialId,
      });
    }

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: this.localesService.translate('message.user.userNotFound'),
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user: user,
      hash,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
        email: user.email,
        sessionId: session.id,
        hash,
      });

    return {
      accessToken,
      refreshToken,
      tokenExpires,
      user,
    };
  }
}
