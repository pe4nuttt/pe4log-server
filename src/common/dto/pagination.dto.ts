import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ESortOrder } from 'src/utils/enums';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (ignored if `all` is true)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page (ignored if `all` is true)',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Limit max items per page to 100
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // Default sorting field

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Sort order',
    default: 'DESC',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? (value as string).toUpperCase() : undefined,
  )
  @IsEnum(ESortOrder)
  order?: ESortOrder = ESortOrder.DESC; // Default sorting order

  @ApiPropertyOptional({
    example: false,
    description: 'Set to true to get all records',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  all?: boolean = false;

  @ApiPropertyOptional({
    description: 'Search field',
  })
  @IsOptional()
  @IsString()
  search?: string | null;
}
