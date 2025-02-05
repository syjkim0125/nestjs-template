import { Column, Entity, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from '@auth/infrastructure/persistence/entities/base.entity';

@Entity('auth')
export class AuthEntity extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  expiresAt: Date;

  @Column()
  revoked: boolean;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
