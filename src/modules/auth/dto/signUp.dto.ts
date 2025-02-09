import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class SignUpDto {
  @ApiProperty({
    type: 'string',
    example: 'Anh',
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('message'),
  })
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Nguyen Tien',
  })
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'Abcd@1234',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
