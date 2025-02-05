import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}

export class InvalidEmailFormatException extends BadRequestException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
  }
}
