import { Injectable } from '@nestjs/common';

import {
  FindOrCreateUserRequest,
  PaginationDto,
  SoftDeleteUserResponse,
  User,
  UserResponse,
  Users,
} from '@common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  findOrCreateUser(
    findOrCreateUserRequest: FindOrCreateUserRequest,
  ): UserResponse {
    const user: User = {
      id: randomUUID(),
      subscribed: false,
      socialMedia: {},
      username: findOrCreateUserRequest.name,
      age: 1,
      password: '22',
    };
    this.users.push(user);
    return {
      id: user.id,
      googleId: findOrCreateUserRequest.googleId,
      email: findOrCreateUserRequest.email,
      name: user.username,
      status: 'ACTIVE',
    };
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
