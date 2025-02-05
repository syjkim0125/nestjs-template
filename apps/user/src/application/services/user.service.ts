import { Inject, Injectable } from '@nestjs/common';

import { UserNotFoundException } from '@user-common/constant/exception';

import { IUserRepository } from '@user-common/domain/repositories/user.repository.interface';
import { UserFactory } from '@user-common/domain/factories/user.factory';
import { User } from '@user-common/domain/models/user';
import { UserStatus } from '@user-common/domain/models/enums/user-status';

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
    if (existingUser && existingUser.getStatus() === UserStatus.ACTIVE)
      return existingUser;

    if (existingUser && existingUser.getStatus() !== UserStatus.ACTIVE) {
      existingUser.updateStatus(UserStatus.ACTIVE);
      await this.userRepository.save(existingUser);
      return existingUser;
    }

    const userId = this.userRepository.nextId();
    const user = this.userFactory.create(userId, googleId, email, name);

    await this.userRepository.save(user);

    return user;
  }

  public async updateUserEmail(
    userId: string,
    newEmail: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    user.updateEmail(newEmail);
    await this.userRepository.save(user);
    return user;
  }
}
