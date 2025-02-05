import { Auth } from '@auth/domain/models/auth';

export interface IAuthRepository {
  nextId(): string;

  findById(sessionId: string): Promise<Auth | null>;

  save(user: Auth): Promise<void>;
}
