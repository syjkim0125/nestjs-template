import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class SessionNotFoundException extends NotFoundException {
  constructor() {
    super('Session not found');
  }
}

export class SessionExpiredException extends UnauthorizedException {
  constructor() {
    super('Session is Expired');
  }
}

export class SessionRevokedException extends UnauthorizedException {
  constructor() {
    super('Session is Revoked');
  }
}

export class RefreshTokenMismatchException extends UnauthorizedException {
  constructor() {
    super('Refresh token not matched');
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(error: any) {
    super(`Invalid refresh token: ${error}`);
  }
}

export class RefreshTokenNotFoundException extends UnauthorizedException {
  constructor() {
    super('No refresh token found in cookies');
  }
}
