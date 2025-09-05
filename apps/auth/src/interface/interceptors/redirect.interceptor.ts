import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        /**
         * 모든 쿠키 설정이 완료된 후 마지막에 리다이렉트 처리
         */
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        console.log('RedirectInterceptor - data:', data); // 디버그 로그
        
        if (data && data.shouldRedirect) {
          console.log('Final redirect to:', data.shouldRedirect);
          res.redirect(data.shouldRedirect);
          delete data.shouldRedirect;
        } else {
          console.log('No redirect needed or shouldRedirect not found');
        }

        return data;
      }),
    );
  }
}
