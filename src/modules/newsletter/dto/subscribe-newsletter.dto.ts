import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SubscribeNewsLetterDto {
  @ApiProperty({
    type: 'string',
    example: 'abc@gmail.com',
  })
  @IsEmail()
  email: string;
}
