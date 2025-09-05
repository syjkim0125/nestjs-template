import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetTempAccessTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        /**
         * OAuth 콜백에서 임시로 accessToken을 쿠키에 저장
         * Next.js Server Actions에서 HttpOnly 쿠키로 토큰 추출 후 처리
         */
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (data && data.accessToken) {
          // 임시 accessToken 쿠키 설정 (5분 TTL)
          res.cookie('tempAccessToken', data.accessToken, {
            httpOnly: true, // Server Actions에서만 접근
            secure: process.env.NODE_ENV === 'production',
            maxAge: 5 * 60 * 1000, // 5분
            sameSite: 'lax',
            path: '/',
          });

          // 리다이렉트 정보를 데이터에 저장 (실제 리다이렉트는 나중에)
          const frontendUrl =
            process.env.FRONTEND_URL || 'http://localhost:3000';
          const redirectUrl = `${frontendUrl}/auth/success`;
          data.shouldRedirect = redirectUrl;

          // 응답 바디에서 accessToken 제거 (보안)
          delete data.accessToken;
        }

        return data;
      }),
    );
  }
}
