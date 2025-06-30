import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LoginAttempt } from './entities/login-attempt.entity';

@Injectable()
export class LoginAttemptRepository extends Repository<LoginAttempt> {
  constructor(private dataSource: DataSource) {
    super(LoginAttempt, dataSource.createEntityManager());
  }
}
