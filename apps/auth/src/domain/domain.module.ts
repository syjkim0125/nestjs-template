import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Factories } from '@auth/domain/factories';

@Module({
  imports: [CqrsModule],
  providers: [
    ...Factories
  ],
  exports: [...Factories]
})
export class DomainModule {}
