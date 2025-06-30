import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoginAttemptsService } from './login-attempts.service';
import { CreateLoginAttemptDto } from './dto/create-login-attempt.dto';
import { UpdateLoginAttemptDto } from './dto/update-login-attempt.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginAttemptsService.findOne(+id);
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
