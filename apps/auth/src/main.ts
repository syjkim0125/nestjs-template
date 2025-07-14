import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AuthModule } from './auth.module';

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
          authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          scopes: { openid: 'OpenID scope' },
        },
      },
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/api/docs/oauth2-redirect.html',
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        scopes: ['openid'],
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  await app.listen(process.env.AUTH_PORT ?? 3000);
}
bootstrap();
