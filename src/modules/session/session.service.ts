import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { SessionRepository } from './session.repository';
import { NullableType } from 'joi';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { User } from '../users/entities/user.entity';
import { Not } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly localesService: LocalesService,
  ) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    return await this.sessionRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    const newSession = this.sessionRepository.create(data);
    return await this.sessionRepository.save(newSession);
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.validation.sessionNotFound'),
      );
    }

    return await this.sessionRepository.save({
      ...entity,
      ...payload,
    });
  }

  async deleteById(id: Session['id']) {
    return this.sessionRepository.softDelete({
      id,
    });
  }

  async deleteByUserId(id: User['id']) {
    return this.sessionRepository.softDelete({
      user: {
        id,
      },
    });
  }

  async deleteByUserIdExceptCurrent(id: User['id'], sessionId: Session['id']) {
    return this.sessionRepository.softDelete({
      user: { id },
      id: Not(sessionId),
    });
  }
}
