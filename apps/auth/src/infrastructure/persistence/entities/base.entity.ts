import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryColumn('varchar', {
    length: 120,
    nullable: false,
    comment: 'aggregate identity',
  })
  id: string;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @VersionColumn()
  version: number;
}
