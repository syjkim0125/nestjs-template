import { Inject, Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

import {
  FindOrCreateUserRequest,
  PaginationDto,
  SoftDeleteUserResponse,
  User,
  Users,
  UserStatus as ProtoUserStatus,
} from '@common';
import { IUserRepository } from '@user-common/domain/repositories/user.repository.interface';
import { UserFactory } from '@user-common/domain/factories/user.factory';
import { UserStatus } from '@user-common/domain/models/enums/user-status';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  private readonly users: User[] = [];

  public async findOrCreateUser(
    findOrCreateUserRequest: FindOrCreateUserRequest,
  ): Promise<User> {
    const {googleId, email, name} = findOrCreateUserRequest;
    const existingUser = await this.userRepository.findByGoogleId(googleId);
    if (existingUser) return {
      id: existingUser.getId(),
      googleId: existingUser.getGoogleId(),
      email: existingUser.getEmail(),
      name: existingUser.getName(),
      status: this.domainToProtoStatus(existingUser.getStatus()),
    };

    const userId = this.userRepository.nextId();
    const user = this.userFactory.create(userId, googleId, email, name);

    await this.userRepository.save(user);

    return {
      id: user.getId(),
      googleId: user.getGoogleId(),
      email: user.getEmail(),
      name: user.getName(),
      status: this.domainToProtoStatus(user.getStatus()),
    };
  }

  private domainToProtoStatus(domainUserStatus: UserStatus): ProtoUserStatus {
    switch (domainUserStatus) {
      case UserStatus.ACTIVE:
        return ProtoUserStatus.ACTIVE; // 0
      case UserStatus.DELETED:
        return ProtoUserStatus.DELETED; // 1
      case UserStatus.PENDING:
        return ProtoUserStatus.PENDING; // 2
    }
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  remove(id: string): SoftDeleteUserResponse {
    return { success: true };
  }

  queryUsers(
    paginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip),
      });
    };
    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });
    return subject.asObservable();
  }
}
