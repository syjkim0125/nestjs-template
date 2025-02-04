import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [
    CommonModule,
    // TypeORM + MariaDB
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const env = CommonModule.envVars;
        return {
          type: 'mysql',
          host: env.DB_HOST,
          port: env.DB_PORT,
          username: env.DB_USERNAME,
          password: env.DB_PASSWORD,
          database: env.DB_DATABASE,
          synchronize: env.TYPEORM_SYNC,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})

export class DatabaseModule {}
