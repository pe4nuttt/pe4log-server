import { Injectable } from '@nestjs/common';
import { UserProviderRepository } from './user-provider.repository';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { UserProvider } from './entities/user-provider.entity';
import { CreateUserProviderDto } from './dto/create-user-provider.dto';

@Injectable()
export class UserProvidersService {
  constructor(
    private readonly userProvider: UserProviderRepository,
    private readonly localesService: LocalesService,
  ) {}

  async create(data: CreateUserProviderDto) {
    const newUserProvider = this.userProvider.create({
      authProvider: data.authProvider,
      authProviderId: data.authProviderId,
      user: {
        id: data.userId,
      },
    });
    return await this.userProvider.save(newUserProvider);
  }

  async update(data: Partial<UserProvider>) {
    const entity = await this.userProvider.findOne({
      where: {
        id: data.id,
      },
    });

    if (!entity) {
      throw new Error(
        this.localesService.translate('message.user.userNotFound'),
      );
    }

    return await this.userProvider.save({
      ...entity,
      ...data,
    });
  }
  async findById(id: UserProvider['id']) {
    return await this.userProvider.findOne({
      where: { id },
    });
  }
}
