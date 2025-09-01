import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { UserModule } from './user.module';

/**
 * Initializes and starts the NestJS user service with Swagger API documentation.
 *
 * Configures Swagger UI with Bearer JWT authentication for accessing protected user endpoints.
 * The application listens on the port specified by the USER_PORT environment variable or defaults to 3001.
 */
async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User service API for managing user information')
    .setVersion('1.0')
    .addTag('user')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT access token obtained from auth service',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.USER_PORT ?? 3001);
}
bootstrap();
