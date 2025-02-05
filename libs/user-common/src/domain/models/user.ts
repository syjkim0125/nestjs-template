import { AggregateRoot } from '@nestjs/cqrs';

import { EmailVO } from '@user-common/domain/models/value-objects/email.vo';
import { UserStatus } from '@user-common/domain/models/enums/user-status';

export class User extends AggregateRoot {
  private version: number;

  constructor(
    private readonly id: string,
    private readonly googleId: string,
    private email: EmailVO,
    private name: string,
    private status: UserStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  public getId(): string {
    return this.id;
  }

  public getGoogleId(): string {
    return this.googleId;
  }

  public getStatus(): UserStatus {
    return this.status;
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getName(): string {
    return this.name;
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

  public updateEmail(newEmail: string): void {
    // 이메일 변경 전 검증 로직
    this.email = new EmailVO(newEmail);
  }

  public updateStatus(status: UserStatus): void {
    this.status = status;
  }

  public setVersion(version: number): number {
    return (this.version = version);
  }
}
