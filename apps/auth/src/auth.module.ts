import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommonModule } from '@common/common.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USER_SERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_URL || 'user-grpc:5000',
          package: process.env.USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../user.proto'),
        },
      },
    ]),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
