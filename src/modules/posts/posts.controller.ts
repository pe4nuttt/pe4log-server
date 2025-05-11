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
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EPostStatus, EUserRole } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';
import _ from 'lodash';
import { GetListPostsDto } from './dto/query-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from 'src/utils/decorators/file.decorator';
import { UpdatePostHTMLDto } from './dto/update-post-html.dto';

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
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  getListPosts(@Query() getListPostsDto: GetListPostsDto) {
    return this.postsService.findManyWithPagination(getListPostsDto);
  }

  @Get('client')
  getListPostsClient(@Query() getListPostsDto: GetListPostsDto) {
    return this.postsService.findManyWithPagination({
      ...getListPostsDto,
      status: EPostStatus.PUBLISHED,
    });
  }

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(+id);
  }

  @Get(':slug/html')
  async getPostHTMLContent(@Param('slug') slug: string) {
    return {
      data: (await this.postsService.getPostHTMLContent(slug)).htmlContent,
    };
  }

  @Get(':slug/client')
  async getPostDetailClient(@Param('slug') slug: string) {
    return {
      data: await this.postsService.getPostByClient(slug),
    };
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
  @Put(':id/html')
  async savePostHtml(
    @Param('id') id: string,
    @Body() updatePostHTMLDto: UpdatePostHTMLDto,
  ) {
    const data = await this.postsService.savePostHTMLContent(
      +id,
      updatePostHTMLDto.htmlContent,
    );

    return {
      message: this.localesService.translate('message.post.updatePostSuccess'),
      data: data.htmlContent,
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

  @ApiBearerAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiFile('file', true)
  @Post(':id/cover-image')
  async uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({
      //       maxSize: 10 * 1024 * 1024,
      //       message: 'File should be less than 10MB',
      //     }),
      //     new FileTypeValidator({ fileType: 'image/*' }),
      //   ],
      // }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
          message: 'File should be less than 5MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: this.localesService.translate(
        'message.post.uploadPostCoverSuccess',
      ),
      data: await this.postsService.uploadCoverImage(+id, file),
    };
  }

  @Post(':slug/view')
  @HttpCode(HttpStatus.OK)
  async viewPost(@Param('slug') slug: string) {
    await this.postsService.viewPost(slug);
  }
}
