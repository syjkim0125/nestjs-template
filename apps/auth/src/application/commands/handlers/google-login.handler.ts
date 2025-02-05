import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { LoginResult } from '@auth/application/commands/types/login.type';
import { GoogleLoginCommand } from '@auth/application/commands/impl/google-login.command';
import { GoogleLoginCommandResult } from '@auth/application/commands/impl/google-login.result';
import { IJwtProvider } from '@auth/application/ports/jwt/jwt.provider.interface';
import { UserService } from '@auth/application/commands/sevices/user.service';
import { AuthService } from '@auth/application/commands/sevices/auth.service';
import { OauthService } from '@auth/application/commands/sevices/oauth.service';

import { Provider } from '@auth/domain/models/enums/provider';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  constructor(
    @Inject('IJwtProvider')
    private readonly jwtProvider: IJwtProvider,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
  ) {}

  @Transactional()
  public async execute(
    command: GoogleLoginCommand,
  ): Promise<GoogleLoginCommandResult> {
    const { userProfile } = command;

    return await this.googleLogin(
      userProfile.googleId,
      userProfile.email,
      userProfile.name,
    );
  }

  private async googleLogin(
    googleId: string,
    email: string,
    name: string,
  ): Promise<LoginResult> {
    // 1) 유저 찾거나 생성
    const user = await this.userService.findOrCreateUser(googleId, email, name);

    const expiresInSeconds = this.jwtProvider.getRefreshTokenExpiresInSeconds();
    const auth = await this.authService.createAuth(
      user.getId(),
      expiresInSeconds,
    );

    const oauth = await this.oauthService.createOauth(
      user.getId(),
      email,
      name,
      Provider.GOOGLE,
    );

    // 2) 토큰 생성
    const tokens = await this.jwtProvider.issueTokens({
      sub: user.getId(),
      email: user.getEmail(),
      sessionId: auth.getId(),
    });

    await this.authService.saveAuth(auth, tokens.hashedRefreshToken);
    await this.oauthService.saveOauth(oauth);

    return {
      userProfile: {
        googleId: user.getGoogleId(),
        email: user.getEmail(),
        name: user.getName(),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
