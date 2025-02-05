import { Inject, Injectable } from '@nestjs/common';

import { IAuthRepository } from '@auth/domain/repositories/auth.repository.interface';
import { AuthFactory } from '@auth/domain/factories/auth.factory';
import { Auth } from '@auth/domain/models/auth';
import {
  SessionExpiredException,
  SessionNotFoundException,
  SessionRevokedException,
} from '@auth/constant/exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly authFactory: AuthFactory,
  ) {}

  public async createAuth(
    userId: string,
    expiresInSeconds: number,
  ): Promise<Auth> {
    const sessionId = this.authRepository.nextId();
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    return this.authFactory.create(sessionId, userId, expiresAt);
  }

  public async revokeSession(auth: Auth): Promise<void> {
    auth.setRevoke();
    await this.authRepository.save(auth);
  }

  public async saveAuth(auth: Auth, hashedRefreshToken: string): Promise<void> {
    auth.setHashedRefreshToken(hashedRefreshToken);
    await this.authRepository.save(auth);
  }

  public async findAndValidateSession(sessionId: string): Promise<Auth> {
    const auth = await this.authRepository.findById(sessionId);
    if (!auth) throw new SessionNotFoundException();
    this.validateAuthState(auth);
    return auth;
  }

  private validateAuthState(auth: Auth): void {
    if (auth.isExpired()) throw new SessionExpiredException();
    if (auth.isRevoked()) throw new SessionRevokedException();
  }
}
