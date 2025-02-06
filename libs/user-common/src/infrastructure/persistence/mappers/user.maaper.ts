import { Injectable } from '@nestjs/common';

import { UserEntity } from '@user-common/infrastructure/persistence/entities/user.entity';

import { UserFactory } from '@user-common/domain/factories/user.factory';
import { User } from '@user-common/domain/models/user';

@Injectable()
export class UserMapper {
  constructor(private readonly userFactory: UserFactory) {}

  public toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.getId();
    entity.googleId = domain.getGoogleId();
    entity.email = domain.getEmail();
    entity.name = domain.getName();
    entity.status = domain.getStatus();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.version = domain.getVersion();

    return entity;
  }

  public entityToModel(entity: UserEntity): User {
    const { id, googleId, email, name, status, createdAt, updatedAt, version } =
      entity;
    const domain = this.userFactory.reconstitute(
      id,
      googleId,
      email,
      name,
      status,
      createdAt,
      updatedAt,
    );
    domain.setVersion(version);

    return domain;
  }
}
