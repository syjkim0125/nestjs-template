import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import {
  IUserQuery,
  UserListView,
  UserView,
} from '@user-common/application/queries/interfaces/user-query.interface';
import { UserEntity } from '@user-common/infrastructure/persistence/entities/user.entity';

@Injectable()
export class UserQuery extends Repository<UserEntity> implements IUserQuery {
  constructor(datasource: DataSource) {
    super(UserEntity, datasource.createEntityManager());
  }

  public async findById(userId: string): Promise<UserView | null> {
    const user = await this.findOneBy({ id: userId });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  public async findAll(offset: number, limit: number): Promise<UserListView> {
    const [entities, count] = await this.findAndCount({
      skip: offset,
      take: limit,
    });

    return {
      count,
      users: entities.map((entity) => {
        return {
          id: entity.id,
          name: entity.name,
          email: entity.email,
        };
      }),
    };
  }
}
