import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uuidv7 } from 'uuidv7';

import { OauthEntity } from '@auth/infrastructure/persistence/entities/oauth.entity';
import { OauthMapper } from '@auth/infrastructure/persistence/mappers/oauth.maaper';

import { IOauthRepository } from '@auth/domain/repositories/oauth.repository.interface';
import { Oauth } from '@auth/domain/models/oauth';

@Injectable()
export class OauthRepository implements IOauthRepository {
  constructor(
    @InjectRepository(OauthEntity)
    private readonly oauthRepository: Repository<OauthEntity>,
    private readonly oauthMapper: OauthMapper,
  ) {}

  public nextId(): string {
    return uuidv7();
  }

  public async findById(id: string): Promise<Oauth | null> {
    const entity = await this.oauthRepository.findOneBy({ id });
    return entity ? this.oauthMapper.entityToModel(entity) : null;
  }

  public async save(user: Oauth): Promise<void> {
    user.setVersion(user.getVersion() + 1);
    const userEntity = this.oauthMapper.toEntity(user);
    await this.oauthRepository.save(userEntity);
  }
}
