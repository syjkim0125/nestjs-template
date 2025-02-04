import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { User } from '@user-common/domain/models/user';
import { UserStatus } from '@user-common/domain/models/enums/user-status';
import { EmailVO } from '@user-common/domain/models/value-objects/email.vo';

@Injectable()
export class UserFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  public create(
    id: string,
    googleId: string,
    email: string,
    name: string,
  ): User {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const status = UserStatus.ACTIVE;

    return this.eventPublisher.mergeObjectContext(
      new User(
        id,
        googleId,
        new EmailVO(email),
        name,
        status,
        createdAt,
        updatedAt,
      ),
    );
  }

  public reconstitute(
    id: string,
    googleId: string,
    email: string,
    name: string,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      id,
      googleId,
      new EmailVO(email),
      name,
      status,
      createdAt,
      updatedAt,
    );
  }
}
