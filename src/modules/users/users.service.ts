import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { NullableType } from 'joi';
import { EUserAuthProvider } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { GetListUsersDto } from './dto/query-user.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { parseISODate } from 'src/utils/date';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/auth';
import { Transactional } from 'typeorm-transactional';
import { SessionService } from '../session/session.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { IJwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly localesService: LocalesService,
    private readonly sessionService: SessionService,
    private readonly fileService: FilesService,
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

  async findByUsername(
    username: User['username'],
  ): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User> {
    data.password = await hashPassword(data.password);
    const newUser = this.usersRepository.create(data);
    return await this.usersRepository.save(newUser);
  }

  @Transactional()
  async update(id: User['id'], updateUserData: UpdateUserDto) {
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

    let hashedPassword = entity.password;

    if (updateUserData.password) {
      entity.passwordChangedAt = new Date();
      hashedPassword = await hashPassword(updateUserData.password);

      await this.sessionService.deleteByUserId(id);
    }

    const res = await this.usersRepository.save({
      ...entity,
      ...updateUserData,
      password: hashedPassword,
    });

    delete res.password;

    return res;
  }

  @Transactional()
  async updateMe(currentUser: IJwtPayload, updateUserData: UpdateMeDto) {
    const entity = await this.usersRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.user.userNotFound'),
      );
    }

    if (updateUserData.password) {
      updateUserData.password = await hashPassword(updateUserData.password);

      await this.sessionService.deleteByUserIdExceptCurrent(
        currentUser.id,
        currentUser.sessionId,
      );
    }

    const res = await this.usersRepository.save({
      ...entity,
      ...updateUserData,
    });

    return res;
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

  async findManyWithPagination(
    getListUsersDto: GetListUsersDto,
  ): Promise<PaginationResponseDto<User>> {
    const {
      page,
      limit,
      all,
      search,
      sortBy,
      order,
      status,
      role,
      createdAtFrom,
      createdAtTo,
    } = getListUsersDto;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR CONCAT(user.firstName, ' ', user.lastName) LIKE :search)",
        {
          search: `%${search}%`,
        },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (createdAtFrom && createdAtTo) {
      queryBuilder
        .andWhere('user.createdAt >= :createdAtFrom', {
          createdAtFrom: parseISODate(createdAtFrom),
        })
        .andWhere('user.createdAt <= :createdAtTo', {
          createdAtTo: parseISODate(createdAtTo),
        });
    } else if (createdAtFrom) {
      queryBuilder.andWhere('user.createdAt >= :createdAtFrom', {
        createdAtFrom: parseISODate(createdAtFrom),
      });
    } else if (createdAtTo) {
      queryBuilder.andWhere('user.createdAt <= :createdAtTo', {
        createdAtTo: parseISODate(createdAtTo),
      });
    }

    if (sortBy === 'fullName') {
      queryBuilder.orderBy(`CONCAT(user.firstName, ' ', user.lastName)`, order);
    } else {
      queryBuilder.orderBy(sortBy, order);
    }

    if (!all) {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
    }

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    return new PaginationResponseDto<User>({
      items,
      page: all ? 1 : page,
      limit: all ? totalCount : limit,
      totalPages: all ? 1 : Math.ceil(totalCount / limit),
      totalCount,
    });
  }

  async deleteUser(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        this.localesService.translate('message.user.userNotFound'),
      );
    }

    await this.usersRepository.softDelete(user);
  }

  async updateUserAvatar(id: User['id'], file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        this.localesService.translate('message.user.userNotFound'),
      );
    }

    const imageData = await this.fileService.uploadFile(file, {
      folder: `user/${user.id}`,
      filename_override: `${file.filename}-${Date.now().toString()}`,
      transformation: {
        width: 2000,
        height: 1500,
        crop: 'limit',
        quality: 'auto',
      },
    });

    await this.usersRepository.save({
      ...user,
      profilePicture: imageData.public_id,
    });

    return {
      imageUrl: imageData.secure_url,
      imageKey: imageData.public_id,
    };
  }
}
