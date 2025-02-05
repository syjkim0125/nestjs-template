import {
  TokenPayload,
  Tokens,
} from '@auth/application/commands/types/token.type';

export interface IJwtProvider {
  getRefreshTokenExpiresInSeconds(): number;

  createAccessToken(payload: Record<string, any>): string;

  createRefreshToken(payload: Record<string, any>): string;

  issueTokens(payload: TokenPayload): Promise<Tokens>;

  verifyRefreshToken(token: string): any;

  compareRefreshTokenOrFail(
    plainRefreshToken: string,
    hashedToken: string,
  ): Promise<void>;

  hashToken(token: string): Promise<string>;
}
