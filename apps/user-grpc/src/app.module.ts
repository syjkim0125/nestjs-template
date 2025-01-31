import { Module } from '@nestjs/common';

import { UsersModule } from '@user-grpc/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
