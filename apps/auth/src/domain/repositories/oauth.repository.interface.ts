import { Oauth } from '@auth/domain/models/oauth';

export interface IOauthRepository {
  nextId(): string;

  findById(sessionId: string): Promise<Oauth | null>;

  save(user: Oauth): Promise<void>;
}
