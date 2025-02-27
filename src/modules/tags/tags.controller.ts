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

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Post()
  create(@Body() createTagsDto: CreateTagsDto) {
    return this.tagsService.create(createTagsDto);
  }

  @Get()
  getListTags(@Query() getListTagsDto: GetListTagsDto) {
    return this.tagsService.findManyWithPagination(getListTagsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto) {
    return this.tagsService.update(+id, updateTagsDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
