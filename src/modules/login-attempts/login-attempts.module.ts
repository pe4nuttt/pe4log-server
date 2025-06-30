import { Module } from '@nestjs/common';
import { LoginAttemptsService } from './login-attempts.service';
import { LoginAttemptsController } from './login-attempts.controller';
import { LoginAttemptRepository } from './login-attempts.repository';

@Module({
  controllers: [LoginAttemptsController],
  providers: [LoginAttemptsService, LoginAttemptRepository],
  exports: [LoginAttemptsService],
})
export class LoginAttemptsModule {}
