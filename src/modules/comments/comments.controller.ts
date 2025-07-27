import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { EUserRole } from 'src/utils/enums';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { UserDecorator } from 'src/utils/decorators/user.decorator';
import { IJwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.USER)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @UserDecorator() user: IJwtPayload,
  ) {
    const data = await this.commentsService.create(createCommentDto, user.id);
    return {
      message: this.localesService.translate(
        'message.comment.addCommentSuccess',
      ),
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.USER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserDecorator() user: IJwtPayload,
  ) {
    const data = await this.commentsService.update(+id, updateCommentDto, user);
    return {
      message: this.localesService.translate(
        'message.comment.editCommentSuccess',
      ),
      data,
    };
  }

  @Get(':slug/tree')
  @Public()
  @UseGuards(JwtGuard)
  async getCommentTreeBySlug(
    @Param('slug') slug: string,
    @UserDecorator() user: IJwtPayload,
  ) {
    return {
      data: await this.commentsService.getCommentTreeBySlug(slug, user?.id),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @UserDecorator() user: IJwtPayload) {
    await this.commentsService.remove(+id, user);

    return {
      message: this.localesService.translate(
        'message.comment.deleteCommentSuccess',
      ),
    };
  }
}
