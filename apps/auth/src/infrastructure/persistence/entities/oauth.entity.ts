import { Column, Entity, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from '@auth/infrastructure/persistence/entities/base.entity';

import { Provider } from '@auth/domain/models/enums/provider';

@Entity('oauth')
export class OauthEntity extends BaseEntity {
  @Column()
  userId: string;

  // provider: 'google', 'kakao', 'naver', 'facebook', etc.
  @Column({ type: 'enum', enum: Provider, nullable: false })
  provider: Provider;

  @Column()
  email: string;

  @Column()
  name: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
