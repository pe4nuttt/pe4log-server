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
import { User } from '../entities/user.entity';
import { EUserRole, EUserStatus } from 'src/utils/enums';
import { Transform } from 'class-transformer';

export class FilterUserDto {
  @ApiPropertyOptional({
    example: EUserStatus.ACTIVE,
    description: 'Filter by user status',
  })
  @ValidateIf((o) => !!o.status)
  @IsOptional()
  @IsEnum(EUserStatus)
  status?: EUserStatus | null;

  @ApiPropertyOptional({
    example: EUserRole.USER,
    description: 'Filter by user role',
  })
  @ValidateIf((o) => !!o.status)
  @IsOptional()
  @IsEnum(EUserRole)
  role?: EUserRole | null;

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

export class SortUserDto extends PickType(PaginationDto, ['sortBy', 'order']) {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort by field',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy: keyof User | 'fullName' = 'createdAt';
}

export class GetListUsersDto extends IntersectionType(
  PaginationDto,
  FilterUserDto,
  SortUserDto,
) {}
