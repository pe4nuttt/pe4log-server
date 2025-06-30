import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guards/jwtGuard';
import { User } from '../users/entities/user.entity';
import { NullableType } from 'joi';
import { JwtRefreshGuard } from './guards/jwtRefreshGuard';
import { RefreshResponseDto } from './dto/refreshResponse.dto';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { GoogleOAuthGuard } from './guards/googleGuard';
import { GithubOAuthGuard } from './guards/githubGuard';
import { FacebookOAuthGuard } from './guards/facebookGuard';
import { EUserAuthProvider } from 'src/utils/enums';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/configuration.config';
import { PREFERENCE_KEYS } from 'src/utils/constants';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localesService: LocalesService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);

    return {
      message: this.localesService.translate('message.auth.signupSuccess'),
      data,
    };
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Ip() ip: string) {
    const data = await this.authService.signIn(signInDto, ip);

    return {
      message: this.localesService.translate('message.auth.loginSuccess'),
      data,
    };
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async signOut(@Request() request, @Res({ passthrough: true }) res: Response) {
    await this.authService.signOut({
      sessionId: request.user.sessionId,
    });
    res.clearCookie(PREFERENCE_KEYS.REFRESH_TOKEN, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      message: 'Logout successfully',
    };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async me(@Request() request): Promise<NullableType<User>> {
    return this.authService.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Request() request): Promise<RefreshResponseDto> {
    return await this.authService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.validateSocialLogin(
        EUserAuthProvider.GOOGLE,
        req.user,
      );

    res.cookie(PREFERENCE_KEYS.REFRESH_TOKEN, refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const callbackUrl = this.configService.getOrThrow(
      'auth.clientCallbackUrl',
      {
        infer: true,
      },
    );

    return res.redirect(
      `${callbackUrl}?${PREFERENCE_KEYS.ACCESS_TOKEN}=${accessToken}`,
    );
  }

  @Get('github')
  @UseGuards(GithubOAuthGuard)
  async githubAuth(@Request() req) {}

  @Get('github-redirect')
  @UseGuards(GithubOAuthGuard)
  async githubAuthRedirect(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.validateSocialLogin(
        EUserAuthProvider.GITHUB,
        req.user,
      );

    res.cookie(PREFERENCE_KEYS.REFRESH_TOKEN, refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const callbackUrl = this.configService.getOrThrow(
      'auth.clientCallbackUrl',
      {
        infer: true,
      },
    );

    return res.redirect(
      `${callbackUrl}?${PREFERENCE_KEYS.ACCESS_TOKEN}=${accessToken}`,
    );
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth(@Request() req) {}

  @Get('facebook-redirect')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuthRedirect(@Request() req, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.validateSocialLogin(
        EUserAuthProvider.FACEBOOK,
        req.user,
      );

    res.cookie(PREFERENCE_KEYS.REFRESH_TOKEN, refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const callbackUrl = this.configService.getOrThrow(
      'auth.clientCallbackUrl',
      {
        infer: true,
      },
    );

    return res.redirect(
      `${callbackUrl}?${PREFERENCE_KEYS.ACCESS_TOKEN}=${accessToken}`,
    );
  }
}
