import { InvalidEmailFormatException } from '@user-common/constant/exception';

export class EmailVO {
  private readonly value: string;

  constructor(email: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new InvalidEmailFormatException(email);
    }
    this.value = email;
  }

  public getValue(): string {
    return this.value;
  }
}
