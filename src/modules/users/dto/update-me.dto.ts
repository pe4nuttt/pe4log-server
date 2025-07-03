import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'username',
  'password',
]) {
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
