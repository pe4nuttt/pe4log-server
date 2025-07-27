import { Injectable } from '@nestjs/common';
import { CreateLoginAttemptDto } from './dto/create-login-attempt.dto';
import { UpdateLoginAttemptDto } from './dto/update-login-attempt.dto';
import { LoginAttemptRepository } from './login-attempts.repository';
import axios from 'axios';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LoginAttemptsService {
  constructor(
    private readonly loginAttemptRepository: LoginAttemptRepository,
  ) {}

  async create(createLoginAttemptDto: CreateLoginAttemptDto) {
    const { userId, ip, isSuccessful, failureReason } = createLoginAttemptDto;

    let location: string | null = null;

    if (ip) {
      const ipParam = ip === '::1' ? '' : ip;

      try {
        const response = await axios.get(`http://ip-api.com/json/${ipParam}`);
        const data = response.data;
        if (data && data.status === 'success') {
          location = `${data.city}, ${data.regionName}, ${data.country_name}`;
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    }

    try {
      const loginAttempt = this.loginAttemptRepository.create({
        user: userId
          ? {
              id: userId,
            }
          : null,
        ip,
        isSuccessful,
        failureReason,
        location,
      });

      const data = await this.loginAttemptRepository.save(loginAttempt);

      return data;
    } catch (error) {
      console.error('Error creating login attempt:', error);
    }
  }

  findAll() {
    return `This action returns all loginAttempts`;
  }

  async findByUserId(userId: User['id']) {
    return await this.loginAttemptRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} loginAttempt`;
  }

  update(id: number, updateLoginAttemptDto: UpdateLoginAttemptDto) {
    return `This action updates a #${id} loginAttempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginAttempt`;
  }
}
