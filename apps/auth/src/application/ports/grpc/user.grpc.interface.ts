import { UserResponse } from '@auth/application/commands/types/user.type';

export interface IUserGrpcPort {
  findOrCreateUser(
    googleId: string,
    email: string,
    name: string,
  ): Promise<UserResponse>;

  // softDeleteUser(userId: string): Promise<void>;
}
