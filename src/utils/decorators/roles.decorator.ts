import { SetMetadata } from '@nestjs/common';
import { EUserRole } from '../enums';
import { ROLE_KEY } from '../constants';

export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLE_KEY, roles);
