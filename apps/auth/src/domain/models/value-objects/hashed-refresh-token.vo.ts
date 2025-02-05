export abstract class HashedRefreshTokenVO {
  abstract isSet(): boolean;

  abstract getValue(): string;
}

export class RealHashedRefreshTokenVO extends HashedRefreshTokenVO {
  constructor(private readonly value: string) {
    super();
  }

  isSet(): boolean {
    return true;
  }

  getValue(): string {
    return this.value;
  }
}

export class EmptyHashedRefreshTokenVO extends HashedRefreshTokenVO {
  isSet(): boolean {
    return false;
  }

  getValue(): string {
    return '';
  }
}
