import { Injectable } from '@nestjs/common';

import { AuthEntity } from '@auth/infrastructure/persistence/entities/auth.entity';

import { Auth } from '@auth/domain/models/auth';
import { AuthFactory } from '@auth/domain/factories/auth.factory';

@Injectable()
export class AuthMapper {
  constructor(private readonly authFactory: AuthFactory) {}

  public toEntity(domain: Auth): AuthEntity {
    const entity = new AuthEntity();
    entity.id = domain.getId();
    entity.userId = domain.getUserId();
    entity.expiresAt = domain.getExpiresAt();
    entity.revoked = domain.isRevoked();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.hashedRefreshToken = domain.getHashedRefreshToken();
    entity.version = domain.getVersion();

    return entity;
  }

  public entityToModel(entity: AuthEntity): Auth {
    const {
      id,
      userId,
      expiresAt,
      revoked,
      createdAt,
      updatedAt,
      hashedRefreshToken,
      version,
    } = entity;
    const domain = this.authFactory.reconstitute(
      id,
      userId,
      expiresAt,
      revoked,
      createdAt,
      updatedAt,
      hashedRefreshToken,
    );
    domain.setVersion(version);

    return domain;
  }
}
