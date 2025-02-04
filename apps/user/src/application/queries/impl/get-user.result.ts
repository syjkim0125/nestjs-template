import { IQueryResult } from '@nestjs/cqrs';

export class GetUserResult implements IQueryResult {
  id: string;
  name: string;
  email: string;
}
