import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { Oauth } from '@auth/domain/models/oauth';
import { Provider } from '@auth/domain/models/enums/provider';

@Injectable()
export class OauthFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  public create(
    id: string,
    userId: string,
    email: string,
    name: string,
    provider: Provider,
  ): Oauth {
    const createdAt = new Date();
    const updatedAt = createdAt;

    return this.eventPublisher.mergeObjectContext(
      new Oauth(id, userId, email, name, provider, createdAt, updatedAt),
    );
  }

  public reconstitute(
    id: string,
    userId: string,
    email: string,
    name: string,
    provider: Provider,
    createdAt: Date,
    updatedAt: Date,
  ): Oauth {
    return this.eventPublisher.mergeObjectContext(
      new Oauth(id, userId, email, name, provider, createdAt, updatedAt),
    );
  }
}
