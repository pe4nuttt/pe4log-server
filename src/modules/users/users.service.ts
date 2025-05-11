import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { NullableType } from 'joi';
import { EUserAuthProvider } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly localesService: LocalesService,
  ) {}

  async findById(id: User['id']): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User> {
    const newUser = this.usersRepository.create(data);
    return await this.usersRepository.save(newUser);
  }

  async update(id: User['id'], updateUserData: Partial<User>) {
    const entity = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.user.userNotFound'),
      );
    }

    return await this.usersRepository.save({
      ...entity,
      ...updateUserData,
    });
  }

  async findBySocialIdAndProvider(
    socialId: string,
    provider: EUserAuthProvider,
  ) {
    return await this.usersRepository.findOne({
      where: {
        userProviders: {
          authProviderId: socialId,
          authProvider: provider,
        },
      },
    });
  }
}
