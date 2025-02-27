import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { CategoryRepository } from './category.repository';
import { generateSlug } from 'src/utils/slug';
import { Category } from './entities/category.entity';
import { NullableType } from 'joi';
import { GetListCategoriesDto } from './dto/query-category.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { DataSource } from 'typeorm';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly localesService: LocalesService,
    private dataSource: DataSource,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create({
      ...data,
      slug: generateSlug(data.name),
    });

    return await this.categoryRepository.save(newCategory);
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findManyWithPagination(
    getListCategoriesDto: GetListCategoriesDto,
  ): Promise<PaginationResponseDto<Category>> {
    const { page, limit, all, search, sortBy, order } = getListCategoriesDto;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.andWhere(
        '(category.name LIKE :search OR category.slug LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    queryBuilder.orderBy(sortBy, order);

    if (!all) {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
    }

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    return new PaginationResponseDto<Category>({
      items,
      page: all ? 1 : page,
      limit: all ? totalCount : limit,
      totalPages: all ? 1 : Math.ceil(totalCount / limit),
      totalCount,
    });
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: Category['id'], updateCategoryDto: UpdateCategoryDto) {
    const entity = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      updateCategoryDto.slug = generateSlug(updateCategoryDto.name);
    }

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.validation.sessionNotFound'),
      );
    }

    return await this.categoryRepository.save({
      ...entity,
      ...updateCategoryDto,
    });
  }

  async remove(id: Category['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
