import { AggregateRoot } from '@nestjs/cqrs';

import { Provider } from '@auth/domain/models/enums/provider';

export class Oauth extends AggregateRoot {
  private version: number;

  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly email: string,
    private readonly name: string,
    private provider: Provider,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getProvider(): Provider {
    return this.provider;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getVersion(): number {
    return this.version ? this.version : 0;
  }

  public setVersion(version: number): number {
    return (this.version = version);
  }
}
