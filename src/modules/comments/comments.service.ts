import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { Like } from 'typeorm';
import { LocalesService } from 'src/services/i18n/i18n.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IJwtPayload } from '../auth/interfaces/jwtPayload.interface';
import { ICommentTreeNode } from 'src/utils/interfaces/comment.interface';
import { ECommentReactionType, EUserRole } from 'src/utils/enums';
import { NullableType } from 'joi';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly localesService: LocalesService,
  ) {}

  private readonly SEGMENT_LENGTH = 3;
  private readonly MAX_DEPTH = 9;

  private padSegment(index: number): string {
    return index.toString().padStart(this.SEGMENT_LENGTH, '0');
  }

  private getTopLevelLikePattern(): string {
    return `${'_'.repeat(this.SEGMENT_LENGTH)}${'0'.repeat(this.SEGMENT_LENGTH * (this.MAX_DEPTH - 1))}`;
  }

  private getChildLikePattern(parentPath: string, depth: number): string {
    const prefix = parentPath.slice(0, depth * this.SEGMENT_LENGTH);
    return `${prefix}${'_'.repeat(this.SEGMENT_LENGTH)}${'0'.repeat(this.SEGMENT_LENGTH * (this.MAX_DEPTH - depth - 1))}`;
  }

  private getParentPath(path: string, depth: number): string {
    if (depth <= 1) {
      return '';
    }

    const parentDepth = depth - 1;

    const prefix = path.slice(0, parentDepth * this.SEGMENT_LENGTH);
    const padded = '0'.repeat(
      this.SEGMENT_LENGTH * (this.MAX_DEPTH - (depth - 1)),
    );

    const parentPath = prefix + padded;

    return parentPath;
  }

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { postSlug, content, parentId } = createCommentDto;
    let path: string;
    let depth = 1;
    if (!parentId) {
      const lastTopLevel = await this.commentRepository.findOne({
        where: {
          post: {
            slug: postSlug,
          },
          path: Like(this.getTopLevelLikePattern()),
        },
        order: {
          path: 'DESC',
        },
      });

      const lastIndex = lastTopLevel
        ? parseInt(lastTopLevel.path.slice(0, this.SEGMENT_LENGTH), 10)
        : -1;

      if (lastIndex + 1 >= 10 ** this.SEGMENT_LENGTH) {
        throw new BadRequestException(
          this.localesService.translate('message.comment.maxCommentReached'),
        );
      }
      const segment = this.padSegment(lastIndex + 1);
      path = segment + '0'.repeat(this.SEGMENT_LENGTH * (this.MAX_DEPTH - 1));
    } else {
      const parent = await this.commentRepository.findOneByOrFail({
        id: parentId,
      });
      depth = parent.depth + 1;

      if (depth >= this.MAX_DEPTH) {
        throw new BadRequestException(
          this.localesService.translate('message.comment.maxNestedComment'),
        );
      }

      const prefix = parent.path.slice(0, parent.depth * this.SEGMENT_LENGTH);
      const lastChild = await this.commentRepository.findOne({
        where: {
          post: {
            slug: postSlug,
          },
          depth,
          path: Like(this.getChildLikePattern(parent.path, parent.depth)),
        },
        order: { path: 'DESC' },
      });

      const lastIndex = lastChild
        ? parseInt(
            lastChild.path.slice(
              parent.depth * this.SEGMENT_LENGTH,
              depth * this.SEGMENT_LENGTH,
            ),
          )
        : 0;

      if (lastIndex + 1 >= 10 ** this.SEGMENT_LENGTH) {
        throw new BadRequestException(
          this.localesService.translate('message.comment.maxCommentReached'),
        );
      }

      const segment = this.padSegment(lastIndex + 1);

      path =
        prefix +
        segment +
        '0'.repeat(this.SEGMENT_LENGTH * (this.MAX_DEPTH - depth));
    }

    const comment = this.commentRepository.create({
      content: content,
      depth: depth,
      post: {
        slug: postSlug,
      },
      user: {
        id: userId,
      },
      path,
    });

    return await this.commentRepository.save(comment);
  }

  async update(
    id: Comment['id'],
    updateCommentDto: UpdateCommentDto,
    currentUser: IJwtPayload,
  ) {
    const entity = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.comment.commentNotFound'),
      );
    }

    if (entity.user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return await this.commentRepository.save({
      ...entity,
      content: updateCommentDto.content,
    });
  }

  async remove(id: Comment['id'], currentUser: IJwtPayload) {
    const entity = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        this.localesService.translate('message.comment.commentNotFound'),
      );
    }

    if (
      entity.user.id !== currentUser.id &&
      currentUser.role !== EUserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }

    await this.commentRepository.softDelete(id);
  }

  async findById(id: Comment['id']): Promise<NullableType<Comment>> {
    return await this.commentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByPostSlug(slug: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: {
        post: {
          slug,
        },
      },
      order: { path: 'ASC' },
    });
  }

  async getCommentTreeBySlug(slug: string, currentUserId?: number) {
    const { raw, entities } = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin('comment.commentReactions', 'comment-reaction')
      .where('comment.postSlug = :slug', { slug })
      .andWhere('comment.deletedAt IS NULL')
      .select([
        'comment',
        'user',
        'COUNT(CASE WHEN comment-reaction.type = :like THEN 1 END) AS likesCount',
        'COUNT(CASE WHEN comment-reaction.type = :dislike THEN 1 END) AS dislikesCount',
        'MAX(CASE WHEN comment-reaction.userId = :currentUserId AND comment-reaction.type = :like THEN 1 ELSE 0 END) AS isLiked',
        'MAX(CASE WHEN comment-reaction.userId = :currentUserId AND comment-reaction.type = :dislike THEN 1 ELSE 0 END) AS isDisliked',
      ])
      .setParameters({
        like: ECommentReactionType.LIKE,
        dislike: ECommentReactionType.DISLIKE,
        currentUserId: currentUserId || null,
      })
      .groupBy('comment.id')
      .orderBy('comment.path', 'ASC')
      .getRawAndEntities();

    const comments: ICommentTreeNode[] = entities.map(
      (comment: ICommentTreeNode) => {
        const rawRow = raw.find((r) => r.comment_id === comment.id);

        comment.likesCount = Number(rawRow.likesCount);
        comment.dislikesCount = Number(rawRow.dislikesCount);
        comment.isLiked = rawRow.isLiked === '1';
        comment.isDisliked = rawRow.isDisliked === '1';

        return comment;
      },
    );

    const nodeMap = new Map<string, ICommentTreeNode>();
    const tree: ICommentTreeNode[] = [];

    for (const comment of comments) {
      const node = {
        ...comment,
        children: [],
      };

      nodeMap.set(comment.path, node);

      if (comment.depth === 1) {
        tree.push(node);
      } else {
        const parentPath = this.getParentPath(comment.path, comment.depth);
        const parentNode = nodeMap.get(parentPath);

        if (parentNode) {
          parentNode.children.push(node);
        }
      }
    }

    return tree;

    // return tree.sort((a, b) => b.path.localeCompare(a.path));
  }
}
