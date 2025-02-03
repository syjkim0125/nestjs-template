import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  FindOrCreateUserRequest,
  USER_SERVICE_NAME,
  Users,
  UserServiceClient,
} from '@app/common';
import { USER_SERVICE } from './constants';

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

  create(dto: FindOrCreateUserRequest) {
    return this.userService.findOrCreateUser(dto);
  }
}
