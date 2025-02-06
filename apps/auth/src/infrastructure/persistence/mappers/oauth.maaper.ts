import { Injectable } from '@nestjs/common';

import { OauthEntity } from '@auth/infrastructure/persistence/entities/oauth.entity';

import { OauthFactory } from '@auth/domain/factories/oauth.factory';
import { Oauth } from '@auth/domain/models/oauth';

@Injectable()
export class OauthMapper {
  constructor(private readonly oauthFactory: OauthFactory) {}

  public toEntity(domain: Oauth): OauthEntity {
    const entity = new OauthEntity();
    entity.id = domain.getId();
    entity.userId = domain.getUserId();
    entity.email = domain.getEmail();
    entity.name = domain.getName();
    entity.provider = domain.getProvider();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.version = domain.getVersion();

    return entity;
  }

  public entityToModel(entity: OauthEntity): Oauth {
    const { id, userId, email, name, provider, createdAt, updatedAt, version } =
      entity;
    const domain = this.oauthFactory.reconstitute(
      id,
      userId,
      email,
      name,
      provider,
      createdAt,
      updatedAt,
    );
    domain.setVersion(version);

    return domain;
  }
}
