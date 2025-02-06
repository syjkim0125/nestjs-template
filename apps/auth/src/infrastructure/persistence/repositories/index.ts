import { AuthRepository } from '@auth/infrastructure/persistence/repositories/auth.repository';
import { OauthRepository } from '@auth/infrastructure/persistence/repositories/oauth.repository';

export const Repositories = [
  { provide: 'IAuthRepository', useClass: AuthRepository },
  { provide: 'IOauthRepository', useClass: OauthRepository },
];
