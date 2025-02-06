import { ICommand } from '@nestjs/cqrs';

export class IssueRefreshTokenCommand implements ICommand {
  constructor(public readonly refreshToken: string) {}
}
