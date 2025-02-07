import { ConflictException, Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;

  constructor(
    private readonly userService: UsersService,
    private readonly localesService: LocalesService,
    private readonly configSerivce: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const isExistedUser = await this.userService.findByEmail(signUpDto.email);

      console.log('[CHECK]', ms('90 days'), ms);

      if (isExistedUser) {
        throw new ConflictException(
          this.localesService.translate(
            'message.validation.emailAlreadyExisted',
          ),
        );
      }

      const hashedPassword = await bcrypt.hash(
        signUpDto.password,
        this.SALT_ROUND,
      );

      const user = await this.userService.create({
        ...signUpDto,
        password: hashedPassword,
        role: EUserRole.USER,
        authProvider: EUserAuthProvider.EMAIL,
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

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    email: User['email'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configSerivce.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn as ms.StringValue);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          email: data.email,
          sessionId: data.sessionId,
        },
        {
          expiresIn: tokenExpiresIn,
          secret: this.configSerivce.getOrThrow('auth.secret', {
            infer: true,
          }),
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          expiresIn: tokenExpiresIn,
          secret: this.configSerivce.getOrThrow('auth.secret', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }
}
