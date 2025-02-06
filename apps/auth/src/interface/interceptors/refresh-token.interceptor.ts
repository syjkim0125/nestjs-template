import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetRefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle()은 컨트롤러(또는 이전 인터셉터)에서 return한 값을 스트림 형태로 전달
    return next.handle().pipe(
      map((data) => {
        /**
         * 1. HTTP 컨텍스트 가져오기
         * 2. Express Response 객체 추출
         * 3. data에 refreshToken이 있으면 쿠키 설정
         * 4. data에서 refreshToken을 제거(또는 유지)
         */
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        if (data && data.refreshToken) {
          // 쿠키 설정
          res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // 응답 바디에서 refreshToken을 제거(선택 사항)
          delete data.refreshToken;
        }

        // 최종적으로 수정된 data를 return하면, Nest가 JSON 응답을 보냄
        return data;
      }),
    );
  }
}
