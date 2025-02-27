import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
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

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localesService: LocalesService,
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
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(signInDto);

    return {
      message: this.localesService.translate('message.auth.loginSuccess'),
      data,
    };
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Request() request) {
    await this.authService.signOut({
      sessionId: request.user.sessionId,
    });
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
}
