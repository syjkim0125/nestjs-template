import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';

import { Controllers } from '@auth/interface/controllers';
import { Guards } from '@auth/interface/guards';
import { Interceptors } from '@auth/interface/interceptors';
import { Filters } from '@auth/interface/filters';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
  ],
  controllers: [...Controllers],
  providers: [
    ...Guards,
    ...Interceptors,
    ...Filters,
  ],
  exports: [...Guards]
})
export class InterfaceModule {}
