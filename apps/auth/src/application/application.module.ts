import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommonModule } from '@user-common';
import { DomainModule } from '@auth/domain/domain.module';
import { InfrastructureModule } from '@auth/infrastructure/infrastructure.module';

import { CommandHandlers } from '@auth/application/commands/handlers';
import { ApplicationServices } from '@auth/application/commands/sevices';
import { Sagas } from '@auth/application/sagas';

@Module({
  imports: [
    CqrsModule,
    UserCommonModule,
    InfrastructureModule,
    DomainModule,
  ],
  providers: [
    ...CommandHandlers,
    ...ApplicationServices,
    ...Sagas,
  ],
  exports: [...ApplicationServices],
})
export class ApplicationModule {}
