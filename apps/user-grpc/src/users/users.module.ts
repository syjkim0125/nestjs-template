import { Module } from '@nestjs/common';
import { UserCommonModule } from '@user-common';

import { UsersController } from '@user-grpc/users/users.controller';
import { UsersService } from '@user-grpc/users/users.service';

@Module({
  imports: [UserCommonModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
