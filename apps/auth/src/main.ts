import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from './auth.module';

/**
 * Initializes and starts the NestJS authentication service with Swagger API documentation, OAuth2 integration, CORS, and cookie parsing.
 *
 * Configures Swagger UI with OAuth2 client settings for Google authentication and serves the documentation at `/api/docs`. The application listens on the port specified by the `AUTH_PORT` environment variable or defaults to 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API description')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addCookieAuth('refreshToken')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: `${process.env.BASE_URL || 'http://localhost:8080'}/auth/google`,
          tokenUrl: `${process.env.BASE_URL || 'http://localhost:8080'}/auth/google/callback`,
          scopes: {
            openid: 'OpenID scope',
            profile: 'Profile scope',
            email: 'Email scope',
          },
        },
      },
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      oauth2RedirectUrl: `${process.env.BASE_URL || 'http://localhost:8080'}/api/docs/oauth2-redirect.html`,
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        scopes: ['openid'],
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  app.use(cookieParser());
  await app.listen(process.env.AUTH_PORT ?? 3000);
}
bootstrap();
