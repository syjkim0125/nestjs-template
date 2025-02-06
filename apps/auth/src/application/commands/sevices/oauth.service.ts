import { Inject, Injectable } from '@nestjs/common';

import { IOauthRepository } from '@auth/domain/repositories/oauth.repository.interface';
import { OauthFactory } from '@auth/domain/factories/oauth.factory';
import { Oauth } from '@auth/domain/models/oauth';
import { Provider } from '@auth/domain/models/enums/provider';

@Injectable()
export class OauthService {
  constructor(
    @Inject('IOauthRepository')
    private readonly oauthRepository: IOauthRepository,
    private readonly oauthFactory: OauthFactory,
  ) {}

  public async createOauth(
    userId: string,
    email: string,
    name: string,
    provider: Provider,
  ): Promise<Oauth> {
    const id = this.oauthRepository.nextId();
    return this.oauthFactory.create(id, userId, email, name, provider);
  }

  public async saveOauth(oauth: Oauth): Promise<void> {
    await this.oauthRepository.save(oauth);
  }
}
