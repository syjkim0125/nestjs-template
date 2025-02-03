import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { USER_PACKAGE_NAME } from '@app/common';
import { UserGrpcModule } from '@user-grpc/user-grpc.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserGrpcModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5000',
        protoPath: join(__dirname, '../user.proto'),
        package: USER_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
