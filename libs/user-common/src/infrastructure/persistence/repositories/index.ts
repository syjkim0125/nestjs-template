import { UserRepository } from '@user-common/infrastructure/persistence/repositories/user.repository';

export const Repositories = [
  { provide: 'IUserRepository', useClass: UserRepository },
];
