import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentReaction } from './entities/comment-reaction.entity';

@Injectable()
export class CommentReactionRepository extends Repository<CommentReaction> {
  constructor(private dataSource: DataSource) {
    super(CommentReaction, dataSource.createEntityManager());
  }
}
