import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommonModule } from '@common/common.module';
import { UserCommonModule } from '@user-common';

import { HttpControllers } from '@user/interface/controllers/http';

import { QueryHandlers } from '@user/application/queries/handlers';
import { ApplicationServices } from '@user/application/services';

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    UserCommonModule,
  ],
  controllers: [...HttpControllers],
  providers: [...QueryHandlers, ...ApplicationServices],
})
export class UserModule {}
