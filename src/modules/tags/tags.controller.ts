import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { GetListTagsDto } from './dto/query-tag.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EUserRole } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Post()
  async create(@Body() createTagsDto: CreateTagsDto) {
    const data = await this.tagsService.create(createTagsDto);
    return {
      message: this.localesService.translate('message.tag.createTagSuccess'),
      data,
    };
  }

  @Get()
  getListTags(@Query() getListTagsDto: GetListTagsDto) {
    return this.tagsService.findManyWithPagination(getListTagsDto);
  }

  @Get('top')
  getTopTags(@Query('limit') limit: string) {
    const limitNumber = parseInt(limit, 10) || 10;
    return this.tagsService.getTopTags(limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto) {
    const data = await this.tagsService.update(+id, updateTagsDto);
    return {
      message: this.localesService.translate('message.tag.updateTagSuccess'),
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tagsService.remove(+id);

    return {
      message: this.localesService.translate('message.tag.deleteTagSuccess'),
    };
  }
}
