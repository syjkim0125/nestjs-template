import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { LoginResult } from '@auth/application/commands/types/login.type';
import { GoogleLoginCommand } from '@auth/application/commands/impl/google-login.command';
import { GoogleLoginCommandResult } from '@auth/application/commands/impl/google-login.result';
import { IJwtProvider } from '@auth/application/ports/jwt/jwt.provider.interface';
import { IUserGrpcPort } from '@auth/application/ports/grpc/user.grpc.interface';
import { AuthService } from '@auth/application/commands/sevices/auth.service';
import { OauthService } from '@auth/application/commands/sevices/oauth.service';

import { Provider } from '@auth/domain/models/enums/provider';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  constructor(
    @Inject('IJwtProvider')
    private readonly jwtProvider: IJwtProvider,
    @Inject('IUserGrpcPort')
    private readonly userGrpcPort: IUserGrpcPort,
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
    const user = await this.userGrpcPort.findOrCreateUser(googleId, email, name);

    const expiresInSeconds = this.jwtProvider.getRefreshTokenExpiresInSeconds();
    const auth = await this.authService.createAuth(
      user.id,
      expiresInSeconds,
    );

    const oauth = await this.oauthService.createOauth(
      user.id,
      email,
      name,
      Provider.GOOGLE,
    );

    // 2) 토큰 생성
    const tokens = await this.jwtProvider.issueTokens({
      sub: user.id,
      email: user.email,
      sessionId: auth.getId(),
    });

    await this.authService.saveAuth(auth, tokens.hashedRefreshToken);
    await this.oauthService.saveOauth(oauth);

    return {
      userProfile: {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
