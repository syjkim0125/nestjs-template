import { Module } from '@nestjs/common';
import { UserCommonService } from './user-common.service';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  providers: [UserCommonService],
  exports: [UserCommonService],
  imports: [DomainModule, InfrastructureModule],
})
export class UserCommonModule {}
