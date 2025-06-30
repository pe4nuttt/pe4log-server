import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { LocalesModule } from 'src/services/i18n/i18n.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LocalesModule, SessionModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
