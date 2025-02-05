import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { LogoutCommand } from '@auth/application/commands/impl/logout.command';
import { IJwtProvider } from '@auth/application/ports/jwt/jwt.provider.interface';
import { AuthService } from '@auth/application/commands/sevices/auth.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject('IJwtProvider')
    private readonly jwtProvider: IJwtProvider,
    private readonly authService: AuthService,
  ) {}

  public async execute(command: LogoutCommand): Promise<void> {
    const { refreshToken } = command;

    const payload = this.jwtProvider.verifyRefreshToken(refreshToken);
    const sessionId = payload.sessionId;

    const auth = await this.authService.findAndValidateSession(sessionId);

    await this.jwtProvider.compareRefreshTokenOrFail(
      refreshToken,
      auth.getHashedRefreshToken(),
    );

    await this.authService.revokeSession(auth);

    auth.logout();
    auth.commit();
  }
}
