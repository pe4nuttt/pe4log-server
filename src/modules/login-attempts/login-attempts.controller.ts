import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LoginAttemptsService } from './login-attempts.service';
import { CreateLoginAttemptDto } from './dto/create-login-attempt.dto';
import { UpdateLoginAttemptDto } from './dto/update-login-attempt.dto';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EUserRole } from 'src/utils/enums';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserDecorator } from 'src/utils/decorators/user.decorator';

@Controller('login-attempts')
export class LoginAttemptsController {
  constructor(private readonly loginAttemptsService: LoginAttemptsService) {}

  // @Post()
  // create(@Body() createLoginAttemptDto: CreateLoginAttemptDto) {
  //   return this.loginAttemptsService.create(createLoginAttemptDto);
  // }

  @Get()
  findAll() {
    return this.loginAttemptsService.findAll();
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  adminFindByUserId(@Param('id') id: string) {
    return this.loginAttemptsService.findByUserId(+id);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  findByCurrentUser(@UserDecorator('id') id: string) {
    return this.loginAttemptsService.findByUserId(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateLoginAttemptDto: UpdateLoginAttemptDto,
  // ) {
  //   return this.loginAttemptsService.update(+id, updateLoginAttemptDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginAttemptsService.remove(+id);
  }
}
