import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetListUsersDto } from './dto/query-user.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EUserRole } from 'src/utils/enums';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { UserDecorator } from 'src/utils/decorators/user.decorator';
import { IJwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersSerivce: UsersService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Get()
  getListUsers(@Query() getListUsersDto: GetListUsersDto) {
    return this.usersSerivce.findManyWithPagination(getListUsersDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  getCurrentUser(@UserDecorator() user: IJwtPayload) {
    return this.usersSerivce.findById(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(
    @UserDecorator() user: IJwtPayload,
    @Body() updateUserDto: UpdateMeDto,
  ) {
    const data = await this.usersSerivce.updateMe(user, updateUserDto);

    return {
      message: this.localesService.translate('message.user.updateUserSuccess'),
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersSerivce.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('by-username/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersSerivce.findByUsername(username);
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UserDecorator() user: IJwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.usersSerivce.update(+id, updateUserDto);

    return {
      message: this.localesService.translate('message.user.updateUserSuccess'),
      data,
    };
  }
}
