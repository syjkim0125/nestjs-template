import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { CommonModule } from '@common/common.module';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserCommonModule } from '@user-common';

import { HttpControllers } from '@user/interface/controllers/http';

import { QueryHandlers } from '@user/application/queries/handlers';

const globalAppGuards = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
];

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    UserCommonModule,
  ],
  controllers: [...HttpControllers],
  providers: [...globalAppGuards, ...QueryHandlers],
})
export class UserModule {}
