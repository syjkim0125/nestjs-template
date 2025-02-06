import { UserQuery } from '@user-common/infrastructure/persistence/queries/user.query';

export const Queries = [{ provide: 'IUserQuery', useClass: UserQuery }];
