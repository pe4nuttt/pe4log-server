import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { NullableType } from 'joi';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

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
}
