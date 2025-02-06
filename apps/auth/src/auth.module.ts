import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UserCommonModule } from '@user-common';
import { InfrastructureModule } from '@auth/infrastructure/infrastructure.module';
import { InterfaceModule } from '@auth/interface/interface.module';
import { ApplicationModule } from '@auth/application/application.module';
import { DomainModule } from '@auth/domain/domain.module';

@Module({
  imports: [
    CommonModule,
    UserCommonModule,
    InfrastructureModule,
    InterfaceModule,
    ApplicationModule,
    DomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
