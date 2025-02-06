import { User } from '@user-common/domain/models/user';

export interface IUserRepository {
  nextId(): string;

  findByGoogleId(googleId: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;

  save(user: User): Promise<void>;
}
