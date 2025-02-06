import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import {
  InvalidRefreshTokenException,
  RefreshTokenMismatchException,
} from '@auth/constant/exception';

import { IJwtProvider } from '@auth/application/ports/jwt/jwt.provider.interface';
import {
  TokenPayload,
  Tokens,
} from '@auth/application/commands/types/token.type';

@Injectable()
export class JwtProvider implements IJwtProvider {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')!;
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN')!;
    this.jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET')!;
    this.jwtRefreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    )!;
  }

  public getRefreshTokenExpiresInSeconds(): number {
    return parseInt(this.jwtRefreshExpiresIn, 10);
  }

  public createAccessToken(payload: Record<string, any>): string {
    return sign(payload, this.jwtSecret, { expiresIn: parseInt(this.jwtExpiresIn, 10) });
  }

  public createRefreshToken(payload: Record<string, any>): string {
    return sign(payload, this.jwtRefreshSecret, {
      expiresIn: parseInt(this.jwtRefreshExpiresIn, 10),
    });
  }

  public async issueTokens(payload: TokenPayload): Promise<Tokens> {
    const newAccessToken = this.createAccessToken(payload);
    // **회전(Rotating) 전략**: 매번 새 Refresh Token 발급
    const newRefreshToken = this.createRefreshToken(payload);
    const newHashedToken = await this.hashToken(newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hashedRefreshToken: newHashedToken,
    };
  }

  public verifyRefreshToken(token: string): any {
    try {
      return verify(token, this.jwtRefreshSecret);
    } catch (error) {
      throw new InvalidRefreshTokenException(error);
    }
  }

  public async compareRefreshTokenOrFail(
    plainRefreshToken: string,
    hashedToken: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(plainRefreshToken, hashedToken);
    if (!isMatch) {
      throw new RefreshTokenMismatchException();
    }
  }

  public async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }
}
