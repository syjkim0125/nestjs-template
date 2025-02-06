import { JwtProvider } from '@auth/infrastructure/adapters/jwt/jwt.provider';
import { UserGrpcAdapter } from '@auth/infrastructure/adapters/grpc/user.grpc.adapter';

export const Adapters = [
  { provide: 'IJwtProvider', useClass: JwtProvider },
  {
    provide: 'IUserGrpcPort',
    useClass: UserGrpcAdapter,
  },
];
