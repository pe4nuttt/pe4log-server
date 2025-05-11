import { Injectable } from '@nestjs/common';
import { UserProvider } from './entities/user-provider.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserProviderRepository extends Repository<UserProvider> {
  constructor(private dataSource: DataSource) {
    super(UserProvider, dataSource.createEntityManager());
  }
}
