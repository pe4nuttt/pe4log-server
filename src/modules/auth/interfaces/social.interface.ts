import { EUserAuthProvider } from 'src/utils/enums';

export interface ISocialUserData {
  socialId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  provider?: EUserAuthProvider;
}
