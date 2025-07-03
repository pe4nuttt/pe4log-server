import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
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
import { CreateUserDto } from './dto/create-user.dto';
import { ApiFile } from 'src/utils/decorators/file.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Get()
  getListUsers(@Query() getListUsersDto: GetListUsersDto) {
    return this.usersService.findManyWithPagination(getListUsersDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  getCurrentUser(@UserDecorator() user: IJwtPayload) {
    return this.usersService.findById(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(
    @UserDecorator() user: IJwtPayload,
    @Body() updateUserDto: UpdateMeDto,
  ) {
    const data = await this.usersService.updateMe(user, updateUserDto);

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
    return this.usersService.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('by-username/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return {
      message: this.localesService.translate('message.user.createUserSuccess'),
      data,
    };
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
    const data = await this.usersService.update(+id, updateUserDto);

    return {
      message: this.localesService.translate('message.user.updateUserSuccess'),
      data,
    };
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: IJwtPayload) {
    await this.usersService.deleteUser(+id);
    return {
      message: this.localesService.translate('message.user.deleteUserSuccess'),
    };
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiFile('file', true)
  @Post(':id/profile-image')
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
          message: 'File should be less than 10MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: this.localesService.translate(
        'message.user.uploadProfileImageSuccess',
      ),
      data: await this.usersService.updateUserAvatar(+id, file),
    };
  }
}
