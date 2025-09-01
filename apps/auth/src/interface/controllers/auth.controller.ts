import {
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiOAuth2,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@common/decorators/public.decorator';
import { RefreshTokenNotFoundException } from '@auth/constant/exception';

import { AuthenticatedRequest } from '@auth/interface/types/authenticated.request';
import { GoogleAuthGuard } from '@auth/interface/guards/google-auth.guard';
import { RefreshTokenInvalidationFilter } from '@auth/interface/filters/refresh-token-invalidate.filter';
import { SetRefreshTokenInterceptor } from '@auth/interface/interceptors/refresh-token.interceptor';
import { GoogleLoginResponseDto } from '@auth/interface/controllers/dtos/google-login-response.dto';
import { IssueRefreshTokenResponseDto } from '@auth/interface/controllers/dtos/issue-refresh-token-response.dto';

import { GoogleLoginCommand } from '@auth/application/commands/impl/google-login.command';
import { IssueRefreshTokenCommand } from '@auth/application/commands/impl/issue-refresh-token.command';
import { LogoutCommand } from '@auth/application/commands/impl/logout.command';

@ApiTags('auth')
@Controller('auth')
@UseFilters(RefreshTokenInvalidationFilter)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  // 1) 구글 로그인 진입점
  @Get('google')
  @ApiExcludeEndpoint()
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard가 자동으로 Google OAuth 페이지로 리다이렉트
  }

  // 2) 구글 로그인 콜백
  @Get('google/callback')
  @ApiExcludeEndpoint()
  @Public()
  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  async googleAuthRedirect(
    @Req() req: AuthenticatedRequest,
  ): Promise<GoogleLoginResponseDto> {
    // Passport Strategy에서 done(null, user)로 넘겨준 user가 req.user로 들어있음
    const user = req.user;

    // 이후 프론트엔드로 리다이렉트하거나, 토큰을 쿠키로 전달, or JSON으로 내려주는 방식 등 고려
    return await this.commandBus.execute(new GoogleLoginCommand(user));
  }

  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @Public()
  @UseInterceptors(SetRefreshTokenInterceptor)
  async refresh(@Req() req: Request): Promise<IssueRefreshTokenResponseDto> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new RefreshTokenNotFoundException();
    }

    return await this.commandBus.execute(
      new IssueRefreshTokenCommand(refreshToken),
    );
  }

  @Post('logout')
  @ApiCookieAuth('refreshToken')
  @Public()
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new RefreshTokenNotFoundException();
    }

    await this.commandBus.execute(new LogoutCommand(refreshToken));

    return { message: 'Logged out from current session.' };
  }

  // @Post('logout-google')
  // async logoutGoogle(@Req() req, @Res() res) {
  //   // 1) 우리 서비스 RefreshToken 만료 등 처리
  //   // 2) 구글 로그아웃 URL 반환 or redirect
  //   return res.redirect('https://accounts.google.com/Logout');
  // }
}
