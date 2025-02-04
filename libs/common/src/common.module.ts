import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema, EnvVars } from '@common/config/env.validation';

@Module({
  imports: [
    // .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: (env): EnvVars => CommonModule.validateEnv(env),
    }),
  ],
})

export class CommonModule {
  static envVars: EnvVars;

  static validateEnv(env: EnvVars): EnvVars {
    const validatedEnv = envSchema.parse(env);
    CommonModule.envVars = validatedEnv; // static 변수에 저장
    return validatedEnv;
  }
}
