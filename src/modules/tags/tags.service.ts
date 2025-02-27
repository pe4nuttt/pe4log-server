import { Injectable } from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { DataSource } from 'typeorm';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { TagRepository } from './tag.repository';
import { generateSlug } from 'src/utils/slug';
import { NullableType } from 'joi';
import { Tag } from './entities/tag.entity';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { GetListTagsDto } from './dto/query-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly localesService: LocalesService,
    private dataSource: DataSource,
  ) {}

  async create(createTagsDto: CreateTagsDto) {
    const newTag = this.tagRepository.create({
      ...createTagsDto,
      slug: generateSlug(createTagsDto.name),
    });

    return await this.tagRepository.save(newTag);
  }

  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tags`;
  }

  async findManyWithPagination(
    getListTagsDto: GetListTagsDto,
  ): Promise<PaginationResponseDto<Tag>> {
    const { page, limit, all, search, sortBy, order } = getListTagsDto;

    const queryBuilder = this.tagRepository.createQueryBuilder('tag');

    if (search) {
      queryBuilder.andWhere(
        '(tag.name LIKE :search OR tag.slug LIKE :search)',
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

    return new PaginationResponseDto<Tag>({
      items,
      page: all ? 1 : page,
      limit: all ? totalCount : limit,
      totalPages: all ? 1 : Math.ceil(totalCount / limit),
      totalCount,
    });
  }

  async findById(id: Tag['id']): Promise<NullableType<Tag>> {
    return await this.tagRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateTagsDto: UpdateTagsDto) {
    return `This action updates a #${id} tags`;
  }

  async remove(id: number): Promise<void> {
    await this.tagRepository.softDelete(id);
  }
}
