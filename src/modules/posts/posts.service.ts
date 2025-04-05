import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { Tag } from '../tags/entities/tag.entity';
import {
  DataSource,
  FindOptionsWhere,
  ILike,
  In,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { TagRepository } from '../tags/tag.repository';
import { generateSlug } from 'src/utils/slug';
import { EPostStatus } from 'src/utils/enums';
import { GetListPostsDto } from './dto/query-post.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { AfterDate, BeforeDate, BetweenDates } from 'src/utils/date';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
    private readonly localesService: LocalesService,
    private readonly dataSource: DataSource,
  ) {}

  async generateNewPost(userId: number) {
    const newPost = this.postRepository.create({
      author: {
        id: userId,
      },
      status: EPostStatus.DRAFT,
    });

    return await this.postRepository.save(newPost);
  }

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  async findManyWithPagination(
    getListPostsDto: GetListPostsDto,
  ): Promise<PaginationResponseDto<Post>> {
    const {
      page,
      limit,
      all,
      search,
      sortBy,
      order,
      authorId,
      categoryId,
      status,
      tagIds,
      createdAtFrom,
      createdAtTo,
    } = getListPostsDto;

    // const queryBuilder = this.postRepository
    //   .createQueryBuilder('post')
    //   .leftJoin('post.tags', 'tag')
    //   .groupBy('post.id');

    // if (search) {
    //   queryBuilder.andWhere(
    //     '(post.title LIKE :search OR post.slug LIKE :search)',
    //     {
    //       search: `%${search}%`,
    //     },
    //   );
    // }

    // if (authorId) {
    //   queryBuilder.andWhere('post.authorId = :authorId', {
    //     authorId,
    //   });
    // }

    // if (categoryId) {
    //   queryBuilder.andWhere('post.categoryId = :categoryId', {
    //     categoryId,
    //   });
    // }

    // if (tagIds?.length) {
    //   queryBuilder
    //     .andWhere('tag.id IN (:...tagIds)', { tagIds })
    //     .having('COUNT(tag.id) > 0');
    // }

    // queryBuilder.orderBy(`post.${sortBy}`, order);

    // if (!all) {
    //   const skip = (page - 1) * limit;
    //   queryBuilder.skip(skip).take(limit);
    // }

    // const [items, totalCount] = await queryBuilder.getManyAndCount();

    // return new PaginationResponseDto<Post>({
    //   items,
    //   page: all ? 1 : page,
    //   limit: all ? totalCount : limit,
    //   totalPages: all ? 1 : Math.ceil(totalCount / limit),
    //   totalCount,
    // });

    const where: FindOptionsWhere<Post> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    if (authorId) {
      where.author = {
        id: authorId,
      };
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.category = {
        id: categoryId,
      };
    }

    if (tagIds?.length) {
      where.tags = { id: In(tagIds) };
    }

    if (createdAtFrom && createdAtTo) {
      where.createdAt = BetweenDates(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      where.createdAt = AfterDate(createdAtFrom);
    } else if (createdAtTo) {
      where.createdAt = BeforeDate(createdAtTo);
    }

    const [items, totalCount] = await this.postRepository.findAndCount({
      where,
      relations: ['tags'],
      order: { [sortBy || 'createdAt']: order || 'DESC' },
      skip: all ? undefined : (page - 1) * limit,
      take: all ? undefined : limit,
    });

    return new PaginationResponseDto<Post>({
      items,
      page: all ? 1 : page,
      limit: all ? totalCount : limit,
      totalPages: all ? 1 : Math.ceil(totalCount / limit),
      totalCount,
    });
  }

  async findById(id: Post['id']) {
    return await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        tags: true,
      },
    });
  }

  @Transactional()
  async update(id: Post['id'], updatePostDto: UpdatePostDto) {
    const entity = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: {
        tags: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.post.postNotFound'),
      );
    }

    if (updatePostDto.title && !updatePostDto.slug) {
      updatePostDto.slug = generateSlug(updatePostDto.title);
    }

    let tmpTags: Tag[] | undefined = undefined;

    if (updatePostDto.tagIds?.length && updatePostDto.tagIds.length > 0) {
      tmpTags = await this.tagRepository.find({
        where: {
          id: In(updatePostDto.tagIds),
        },
      });
    } else if (updatePostDto.tagIds?.length === 0) {
      tmpTags = [];
    }

    return await this.postRepository.save({
      ...entity,
      ...updatePostDto,
      tags: tmpTags,
      category: updatePostDto.categoryId
        ? {
            id: updatePostDto.categoryId,
          }
        : (updatePostDto.categoryId as null | undefined),
    });
  }

  async remove(id: string) {
    await this.postRepository.softDelete(id);
  }
}
