import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { LocalesService } from 'src/services/i18n/i18n.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly localesService: LocalesService,
  ) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  async findById(id: Post['id']) {
    return await this.postRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: Post['id'], updatePostDto: UpdatePostDto) {
    const entity = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.post.postNotFound'),
      );
    }

    return await this.postRepository.save({
      ...entity,
      ...updatePostDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
