type User = {
  id: string;
  name: string;
  email: string;
};

export type UserView = {
  id: string;
  name: string;
  email: string;
};

export type UserListView = {
  count: number;
  users: User[];
};

export interface IUserQuery {
  findById: (userId: string) => Promise<UserView | null>;
  findAll: (offset: number, limit: number) => Promise<UserListView>;
}
