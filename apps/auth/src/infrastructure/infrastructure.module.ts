import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { DatabaseModule } from '@user-common/infrastructure/database.module';

import { USER_SERVICE } from '@auth/constants';
import { Entities } from '@auth/infrastructure/persistence/entities';
import { Mappers } from '@auth/infrastructure/persistence/mappers';
import { Repositories } from '@auth/infrastructure/persistence/repositories';
import { Strategies } from '@auth/infrastructure/strategies';
import { Adapters } from '@auth/infrastructure/adapters';

import { DomainModule } from '@auth/domain/domain.module';

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
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_URL || 'user-grpc:5000',
          package: process.env.USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../user.proto'),
        },
      },
    ]),
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
