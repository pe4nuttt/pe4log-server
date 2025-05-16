import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';

@Injectable()
export class NewsletterRepository extends Repository<Newsletter> {
  constructor(private dataSource: DataSource) {
    super(Newsletter, dataSource.createEntityManager());
  }
}
