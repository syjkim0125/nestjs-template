import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(process.env.AUTH_PORT ?? 3000);
}
bootstrap();
