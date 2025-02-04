import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '@user-common/constant/exception';
import { IUserQuery } from '@user-common/application/queries/interfaces/user-query.interface';

import { GetUserQuery } from '@user/application/queries/impl/get-user.query';
import { GetUserResult } from '@user/application/queries/impl/get-user.result';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, GetUserResult>
{
  constructor(@Inject('IUserQuery') private readonly userQuery: IUserQuery) {}

  public async execute(query: GetUserQuery): Promise<GetUserResult> {
    const { userId } = query;
    const user = await this.userQuery.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
