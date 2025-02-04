import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Entities } from '@user-common/infrastructure/persistence/entities';
import { Mappers } from '@user-common/infrastructure/persistence/mappers';
import { Repositories } from '@user-common/infrastructure/persistence/repositories';
import { Queries } from '@user-common/infrastructure/persistence/queries';

@Module({
  imports: [TypeOrmModule.forFeature([...Entities])],
  providers: [
    ...Mappers,
    ...Repositories,
    ...Queries,
  ],
  exports: [...Repositories]
})
export class InfrastructureModule {}
