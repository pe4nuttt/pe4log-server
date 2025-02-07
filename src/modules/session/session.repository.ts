import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }
}
