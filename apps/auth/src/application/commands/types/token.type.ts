export type TokenPayload = {
  sub: string;
  email: string;
  sessionId: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  hashedRefreshToken: string;
};
