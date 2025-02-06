import { Column, Entity, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from '@user-common/infrastructure/persistence/entities/base.entity';

import { UserStatus } from '@user-common/domain/models/enums/user-status';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @UpdateDateColumn()
  updatedAt: Date;
}
