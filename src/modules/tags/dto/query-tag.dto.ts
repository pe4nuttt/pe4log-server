import {
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Tag } from '../entities/tag.entity';

export class FilterTagDto {}

export class SortTagDto extends PickType(PaginationDto, ['sortBy', 'order']) {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: keyof Tag = 'createdAt';
}

export class GetListTagsDto extends IntersectionType(
  PaginationDto,
  FilterTagDto,
  SortTagDto,
) {}
