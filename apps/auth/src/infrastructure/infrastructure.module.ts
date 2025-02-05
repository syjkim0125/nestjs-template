import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@user-common/infrastructure/database.module';
import { DomainModule } from '@auth/domain/domain.module';

import { Entities } from '@auth/infrastructure/persistence/entities';
import { Mappers } from '@auth/infrastructure/persistence/mappers';
import { Repositories } from '@auth/infrastructure/persistence/repositories';
import { Strategies } from '@auth/infrastructure/strategies';
import { Adapters } from '@auth/infrastructure/adapters';

@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    DomainModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([...Entities]),
  ],
  providers: [
    ...Mappers,
    ...Repositories,
    ...Strategies,
    ...Adapters,
  ],
  exports: [...Repositories, ...Strategies, ...Adapters]
})
export class InfrastructureModule {}
