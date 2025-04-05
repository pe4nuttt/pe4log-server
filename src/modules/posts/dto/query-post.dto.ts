import {
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Post } from '../entities/post.entity';
import { EPostStatus } from 'src/utils/enums';
import { Transform } from 'class-transformer';

export class FilterPostDto {
  @ApiPropertyOptional({
    example: EPostStatus.DRAFT,
    description: 'Filter by post status',
  })
  @ValidateIf((o) => !!o.status)
  @IsOptional()
  @IsEnum(EPostStatus)
  status?: EPostStatus | null;

  @ApiPropertyOptional({
    description: 'Filter by tag IDs',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => value.split(',').map((id: string) => Number(id)))
  tagIds?: number[] | null;

  @ApiPropertyOptional({
    description: 'Filter by author ID',
  })
  @IsOptional()
  @IsInt()
  authorId?: number | null;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
  })
  @IsOptional()
  @ValidateIf((o) => !!o.categoryId)
  @IsInt()
  categoryId?: number | null;

  @ApiPropertyOptional({
    example: '2025-01-01',
  })
  @Transform(({ value }) => value || null)
  @IsOptional()
  @IsDateString()
  createdAtFrom?: Date;

  @ApiPropertyOptional({
    example: '2026-01-01',
  })
  @Transform(({ value }) => value || null)
  @IsOptional()
  @IsDateString()
  createdAtTo?: Date;
}

export class SortPostDto extends PickType(PaginationDto, ['sortBy', 'order']) {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: keyof Post = 'createdAt';
}

export class GetListPostsDto extends IntersectionType(
  PaginationDto,
  FilterPostDto,
  SortPostDto,
) {}
