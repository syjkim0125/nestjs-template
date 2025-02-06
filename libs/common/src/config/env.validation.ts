import { z } from 'zod';

export const envSchema = z.object({
  USER_PORT: z.string().transform(Number).default('3001'),
  AUTH_PORT: z.string().transform(Number).default('3000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('3306'),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  TYPEORM_SYNC: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().transform(Number).default('3600'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().transform(Number).default('604800'),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
});

// TypeScript 타입으로 변환
export type EnvVars = z.infer<typeof envSchema>;
