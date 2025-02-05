import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { Auth } from '@auth/domain/models/auth';
import {
  EmptyHashedRefreshTokenVO,
  RealHashedRefreshTokenVO,
} from '@auth/domain/models/value-objects/hashed-refresh-token.vo';

@Injectable()
export class AuthFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  public create(
    id: string,
    userId: string,
    expiresAt: Date,
    hashedRefreshToken?: string,
  ): Auth {
    const revoked = false;
    const createdAt = new Date();
    const updatedAt = createdAt;

    return this.eventPublisher.mergeObjectContext(
      new Auth(
        id,
        userId,
        hashedRefreshToken
          ? new RealHashedRefreshTokenVO(hashedRefreshToken)
          : new EmptyHashedRefreshTokenVO(),
        expiresAt,
        revoked,
        createdAt,
        updatedAt,
      ),
    );
  }

  public reconstitute(
    id: string,
    userId: string,
    expiresAt: Date,
    revoked: boolean,
    createdAt: Date,
    updatedAt: Date,
    hashedRefreshToken?: string,
  ): Auth {
    return this.eventPublisher.mergeObjectContext(
      new Auth(
        id,
        userId,
        hashedRefreshToken
          ? new RealHashedRefreshTokenVO(hashedRefreshToken)
          : new EmptyHashedRefreshTokenVO(),
        expiresAt,
        revoked,
        createdAt,
        updatedAt,
      ),
    );
  }
}
