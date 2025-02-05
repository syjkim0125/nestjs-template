import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

import { USER_SERVICE } from './constants';
import {
  FindOrCreateUserRequest,
  PaginationDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@common';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  getHello() {
    return this.userService.findAllUsers({});
  }

  query() {
    const users$ = new ReplaySubject<PaginationDto>();

    users$.next({ page: 0, skip: 25 });
    users$.next({ page: 1, skip: 25 });
    users$.next({ page: 2, skip: 25 });
    users$.next({ page: 3, skip: 25 });
    users$.next({ page: 4, skip: 25 });

    users$.complete();

    let chunkNumber = 1;

    this.userService.queryUsers(users$).subscribe((users) => {
      console.log('Chunk', chunkNumber, users);
      chunkNumber += 1;
    });
  }

  create(dto: FindOrCreateUserRequest) {
    return this.userService.findOrCreateUser(dto);
  }
}
