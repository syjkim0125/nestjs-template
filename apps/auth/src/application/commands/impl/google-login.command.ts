import { ICommand } from '@nestjs/cqrs';

type GoogleUserProfile = {
  googleId: string;
  email: string;
  name: string;
};

export class GoogleLoginCommand implements ICommand {
  constructor(public readonly userProfile: GoogleUserProfile) {}
}
