import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { USER } from '@app/common';
import { UserGrpcModule } from '@user-grpc/user-grpc.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserGrpcModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../user.proto'),
        package: USER,
      },
    },
  );
  await app.listen();
}
bootstrap();
