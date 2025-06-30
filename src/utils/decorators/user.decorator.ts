import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwtPayload.interface';

export const UserDecorator = createParamDecorator<
  string | undefined,
  ExecutionContext,
  IJwtPayload
>((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as IJwtPayload;

  return data ? user?.[data] : user;
});
