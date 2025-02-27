import {
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Category } from '../entities/category.entity';

export class FilterCategoryDto {}

export class SortCategoryDto extends PickType(PaginationDto, [
  'sortBy',
  'order',
]) {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: keyof Category = 'createdAt';
}

export class GetListCategoriesDto extends IntersectionType(
  PaginationDto,
  FilterCategoryDto,
  SortCategoryDto,
) {}
