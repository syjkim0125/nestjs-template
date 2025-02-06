import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@user-common/infrastructure/infrastructure.module';

import { DomainModule } from '@user-common/domain/domain.module';

@Module({
  imports: [DomainModule, InfrastructureModule],
  exports: [DomainModule, InfrastructureModule],
})
export class UserCommonModule {}
