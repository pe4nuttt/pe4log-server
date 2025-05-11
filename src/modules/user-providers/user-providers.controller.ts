import { Controller } from '@nestjs/common';
import { UserProvidersService } from './user-providers.service';

@Controller('user-providers')
export class UserProvidersController {
  constructor(private readonly userProvidersService: UserProvidersService) {}
}
