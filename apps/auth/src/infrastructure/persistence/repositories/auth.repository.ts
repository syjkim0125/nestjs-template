import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uuidv7 } from 'uuidv7';

import { AuthEntity } from '@auth/infrastructure/persistence/entities/auth.entity';
import { AuthMapper } from '@auth/infrastructure/persistence/mappers/auth.maaper';

import { IAuthRepository } from '@auth/domain/repositories/auth.repository.interface';
import { Auth } from '@auth/domain/models/auth';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly authMapper: AuthMapper,
  ) {}

  public nextId(): string {
    return uuidv7();
  }

  public async findById(id: string): Promise<Auth | null> {
    const entity = await this.authRepository.findOneBy({ id });
    return entity ? this.authMapper.entityToModel(entity) : null;
  }

  public async save(auth: Auth): Promise<void> {
    auth.setVersion(auth.getVersion() + 1);
    const userEntity = this.authMapper.toEntity(auth);
    await this.authRepository.save(userEntity);
  }
}
