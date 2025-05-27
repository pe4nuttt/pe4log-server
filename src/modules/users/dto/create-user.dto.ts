import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { SLUG_REGEX } from 'src/utils/constants';
import { EUserRole } from 'src/utils/enums';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'Anh',
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'message.validation.firstNameRequired',
    ),
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
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({
    type: 'string',
    example: EUserRole.USER,
    enum: EUserRole,
  })
  role: EUserRole.USER;
}
