import { Session } from 'src/modules/session/entities/session.entity';
import { User } from 'src/modules/users/entities/user.entity';

export interface IJwtPayload {
  id: User['id'];
  role: User['role'];
  email: User['email'];
  sessionId: Session['id'];
  hash: Session['hash'];
}

export interface IAccessTokenPayload extends Omit<IJwtPayload, 'hash'> {}
export interface IRefreshTokenPayload
  extends Pick<IJwtPayload, 'sessionId' | 'hash'> {}
