import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@user-common/infrastructure/database.module';
import { DomainModule } from '@user-common/domain/domain.module';

import { Entities } from '@user-common/infrastructure/persistence/entities';
import { Mappers } from '@user-common/infrastructure/persistence/mappers';
import { Repositories } from '@user-common/infrastructure/persistence/repositories';
import { Queries } from '@user-common/infrastructure/persistence/queries';


@Module({
  imports: [DatabaseModule, DomainModule, TypeOrmModule.forFeature([...Entities])],
  providers: [
    ...Mappers,
    ...Repositories,
    ...Queries,
  ],
  exports: [...Repositories, ...Queries]
})
export class InfrastructureModule {}
