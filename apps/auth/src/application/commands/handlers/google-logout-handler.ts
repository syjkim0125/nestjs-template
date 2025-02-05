import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GoogleLogoutCommand } from '@auth/application/commands/impl/google-logout.command';

@CommandHandler(GoogleLogoutCommand)
export class GoogleLogoutHandler
  implements ICommandHandler<GoogleLogoutCommand>
{
  constructor() {}

  public async execute(command: GoogleLogoutCommand): Promise<void> {
    const { userId } = command;

    console.log('google log out finished!!!: ', userId);
  }
}
