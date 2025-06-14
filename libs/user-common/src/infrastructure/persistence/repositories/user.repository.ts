import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uuidv7 } from 'uuidv7';

import { UserEntity } from '@user-common/infrastructure/persistence/entities/user.entity';
import { UserMapper } from '@user-common/infrastructure/persistence/mappers/user.maaper';

import { IUserRepository } from '@user-common/domain/repositories/user.repository.interface';
import { User } from '@user-common/domain/models/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userMapper: UserMapper,
  ) {}

  public nextId(): string {
    return uuidv7();
  }

  public async findByGoogleId(googleId: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ googleId });
    return entity ? this.userMapper.entityToModel(entity) : null;
  }

  public async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id });
    return entity ? this.userMapper.entityToModel(entity) : null;
  }

  public async save(user: User): Promise<void> {
    const userEntity = this.userMapper.toEntity(user);
    await this.userRepository.save(userEntity);
  }
}
