import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EUserRole } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';
import _ from 'lodash';
import { GetListPostsDto } from './dto/query-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/generate')
  async generateNewPost(@Request() request) {
    const data = await this.postsService.generateNewPost(request.user.id);
    return {
      message: this.localesService.translate(
        'message.post.generatePostSuccess',
      ),
      data: data,
    };
  }

  @ApiBearerAuth()
  @Post()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiBearerAuth()
  @Get()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getListPosts(@Query() getListPostsDto: GetListPostsDto) {
    return this.postsService.findManyWithPagination(getListPostsDto);
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(+id);
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = await this.postsService.update(+id, updatePostDto);

    return {
      message: this.localesService.translate('message.post.updatePostSuccess'),
      data: _.omit(data, ['content']),
    };
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.postsService.remove(id);

    return {
      message: this.localesService.translate('message.post.deletePostSuccess'),
    };
  }
}
