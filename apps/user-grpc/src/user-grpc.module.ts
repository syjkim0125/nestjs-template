import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@user-grpc/users/users.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class UserGrpcModule {}
