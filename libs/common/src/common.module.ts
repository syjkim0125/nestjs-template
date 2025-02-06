import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema, EnvVars } from '@common/config/env.validation';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { JwtStrategy } from '@common/strategies/jwt.strategy';

@Module({
  imports: [
    // .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: (env): EnvVars => CommonModule.validateEnv(env),
    }),
  ],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
  ]
})

export class CommonModule {
  static envVars: EnvVars;

  static validateEnv(env: EnvVars): EnvVars {
    const validatedEnv = envSchema.parse(env);
    CommonModule.envVars = validatedEnv; // static 변수에 저장
    return validatedEnv;
  }
}
