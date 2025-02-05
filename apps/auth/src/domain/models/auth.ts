import { AggregateRoot } from '@nestjs/cqrs';

import {
  EmptyHashedRefreshTokenVO,
  HashedRefreshTokenVO,
  RealHashedRefreshTokenVO,
} from '@auth/domain/models/value-objects/hashed-refresh-token.vo';
import { UserLoggedOutEvent } from '@auth/domain/events/user-logged-out.event';

export class Auth extends AggregateRoot {
  private version: number;

  constructor(
    private readonly id: string,
    private readonly userId: string,
    private hashedRefreshToken: HashedRefreshTokenVO,
    private expiresAt: Date,
    private revoked: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getHashedRefreshToken(): string {
    return this.hashedRefreshToken.getValue();
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getVersion(): number {
    return this.version ? this.version : 0;
  }

  public setHashedRefreshToken(tokenHash: string) {
    this.hashedRefreshToken = new RealHashedRefreshTokenVO(tokenHash);
  }

  public setRevoke() {
    this.revoked = true;
  }

  public hasRefreshToken(): boolean {
    return this.hashedRefreshToken.isSet();
  }

  public removeHashedRefreshToken() {
    this.hashedRefreshToken = new EmptyHashedRefreshTokenVO();
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public isRevoked(): boolean {
    return this.revoked;
  }

  public setVersion(version: number): number {
    return (this.version = version);
  }

  public logout(): void {
    this.apply(new UserLoggedOutEvent(this.userId));
  }
}
