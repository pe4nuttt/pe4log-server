import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwtGuard';
import { GetListCategoriesDto } from './dto/query-category.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EUserRole } from 'src/utils/enums';
import { LocalesService } from 'src/services/i18n/i18n.service';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return {
      message: this.localesService.translate(
        'message.category.createCategorySuccess',
      ),
      data,
    };
  }

  @Get()
  getListCategories(@Query() getListCategoriesDto: GetListCategoriesDto) {
    return this.categoriesService.findManyWithPagination(getListCategoriesDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(+id, updateCategoryDto);
    return {
      message: this.localesService.translate(
        'message.category.updateCategorySuccess',
      ),
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Roles(EUserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);

    return {
      message: this.localesService.translate(
        'message.category.deleteCategorySuccess',
      ),
    };
  }
}
