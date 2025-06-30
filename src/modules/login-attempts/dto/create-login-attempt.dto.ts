import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginAttemptDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    type: 'string',
    example: '::1',
    required: false,
  })
  ip?: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  isSuccessful: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Login failed',
    required: false,
  })
  failureReason?: string;
}
