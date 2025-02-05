import { IssueRefreshTokenHandler } from '@auth/application/commands/handlers/issue-refresh-token.handler';
import { GoogleLoginHandler } from '@auth/application/commands/handlers/google-login.handler';
import { LogoutHandler } from '@auth/application/commands/handlers/logout.handler';
import { GoogleLogoutHandler } from '@auth/application/commands/handlers/google-logout-handler';

export const CommandHandlers = [
  IssueRefreshTokenHandler,
  GoogleLoginHandler,
  LogoutHandler,
  GoogleLogoutHandler,
];
