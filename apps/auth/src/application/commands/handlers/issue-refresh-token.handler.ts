import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { IssueRefreshTokenCommand } from '@auth/application/commands/impl/issue-refresh-token.command';
import { IssueRefreshTokenResult } from '@auth/application/commands/impl/issue-refresh-token.result';
import { IJwtProvider } from '@auth/application/ports/jwt/jwt.provider.interface';
import { AuthService } from '@auth/application/commands/sevices/auth.service';

@CommandHandler(IssueRefreshTokenCommand)
export class IssueRefreshTokenHandler
  implements ICommandHandler<IssueRefreshTokenCommand>
{
  constructor(
    @Inject('IJwtProvider')
    private readonly jwtProvider: IJwtProvider,
    private readonly authService: AuthService,
  ) {}

  public async execute(
    command: IssueRefreshTokenCommand,
  ): Promise<IssueRefreshTokenResult> {
    const { refreshToken } = command;

    return await this.issueRefreshToken(refreshToken);
  }

  private async issueRefreshToken(
    refreshToken: string,
  ): Promise<IssueRefreshTokenResult> {
    // 1) jwt.verify
    const payload = this.jwtProvider.verifyRefreshToken(refreshToken);
    const sessionId = payload.sessionId;
    const userId = payload.sub;
    const email = payload.email;

    // 2) DB에서 auth 조회 & hashedRefreshToken 대조
    const auth = await this.authService.findAndValidateSession(sessionId);

    await this.jwtProvider.compareRefreshTokenOrFail(
      refreshToken,
      auth.getHashedRefreshToken(),
    );

    const tokens = await this.jwtProvider.issueTokens({
      sub: userId,
      email: email,
      sessionId: auth.getId(),
    });

    await this.authService.saveAuth(auth, tokens.hashedRefreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
