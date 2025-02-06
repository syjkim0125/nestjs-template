import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  USER_SERVICE_NAME,
  UserServiceClient,
  UserStatus as ProtoUserStatus
} from '@common';
import { USER_SERVICE } from '@auth/constants';

import { IUserGrpcPort } from '@auth/application/ports/grpc/user.grpc.interface';
import { DomainUserStatus, UserResponse } from '@auth/application/commands/types/user.type';

@Injectable()
export class UserGrpcAdapter implements OnModuleInit, IUserGrpcPort {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async findOrCreateUser(
    googleId: string,
    email: string,
    name: string,
  ): Promise<UserResponse> {
    const result = await lastValueFrom(this.userService.findOrCreateUser({ googleId, email, name }));

    return {
      id: result.id,
      googleId: result.googleId,
      email: result.email,
      name: result.name,
      status: this.protoToDomainStatus(result.status),
    }
  }

  private protoToDomainStatus(protoStatus: ProtoUserStatus): DomainUserStatus {
    switch (protoStatus) {
      case ProtoUserStatus.ACTIVE:
        return DomainUserStatus.ACTIVE;
      case ProtoUserStatus.DELETED:
        return DomainUserStatus.DELETED;
      case ProtoUserStatus.PENDING:
        return DomainUserStatus.PENDING;
    }
  }
}
