export enum DomainUserStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
}

export type UserResponse = {
  id: string;
  googleId: string;
  email: string;
  name: string;
  status: DomainUserStatus;
};
