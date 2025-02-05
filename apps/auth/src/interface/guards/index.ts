import { GoogleAuthGuard } from '@auth/interface/guards/google-auth.guard';
import { JwtAuthGuard } from '@auth/interface/guards/jwt-auth.guard';

export const Guards = [GoogleAuthGuard, JwtAuthGuard];
