import { ICommand } from '@nestjs/cqrs';

export class GoogleLogoutCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
