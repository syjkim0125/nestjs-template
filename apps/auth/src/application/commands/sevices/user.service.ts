import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository } from '@user-common/domain/repositories/user.repository.interface';
import { UserFactory } from '@user-common/domain/factories/user.factory';
import { User } from '@user-common/domain/models/user';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  public async findOrCreateUser(
    googleId: string,
    email: string,
    name: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findByGoogleId(googleId);
    if (existingUser) return existingUser;

    const userId = this.userRepository.nextId();
    const user = this.userFactory.create(userId, googleId, email, name);

    await this.userRepository.save(user);

    return user;
  }
}
