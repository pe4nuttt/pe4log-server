import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export class SignUpResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;
}
