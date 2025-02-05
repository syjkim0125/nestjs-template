import { JwtProvider } from '@auth/infrastructure/adapters/jwt/jwt.provider';

export const Adapters = [{ provide: 'IJwtProvider', useClass: JwtProvider }];
