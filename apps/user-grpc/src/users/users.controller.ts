import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from '@user-grpc/users/users.service';
import {
  FindOneUserDto,
  FindOrCreateUserRequest,
  PaginationDto,
  SoftDeleteUserRequest,
  UserServiceController,
  UserServiceControllerMethods,
} from '@common';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  findOrCreateUser(findOrCreateUserRequest: FindOrCreateUserRequest) {
    return this.usersService.findOrCreateUser(findOrCreateUserRequest);
  }

  softDeleteUser(softDeleteUserRequest: SoftDeleteUserRequest) {
    return this.usersService.remove(softDeleteUserRequest.userId);
  }

  findOneUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(paginationDtoStream);
  }
}
