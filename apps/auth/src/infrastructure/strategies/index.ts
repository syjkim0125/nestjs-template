import { GoogleStrategy } from '@auth/infrastructure/strategies/google.strategy';
import { JwtStrategy } from '@auth/infrastructure/strategies/jwt.strategy';

export const Strategies = [GoogleStrategy, JwtStrategy];
