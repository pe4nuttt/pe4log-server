import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EUserAuthProvider } from 'src/utils/enums';

export class CreateUserProviderDto {
  @IsEnum(EUserAuthProvider)
  authProvider: EUserAuthProvider;

  @IsNotEmpty()
  @IsString()
  authProviderId: string;

  @IsNumber()
  userId: number;
}
