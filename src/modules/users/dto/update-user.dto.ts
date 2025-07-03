import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
) {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
