import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // 클라이언트 헤더에서 JWT 토큰 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 토큰 검증용 secret key
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // 토큰이 만료되면 passport-jwt에서 자동 에러 처리
    });
  }

  // 검증 통과 후 실행, payload는 JWT에 담긴 정보
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
