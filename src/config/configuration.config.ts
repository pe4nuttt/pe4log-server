export interface DatabaseConfig {
  url?: string;
  type: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  db: number;
  keyPrefix: string;
}

export interface AuthConfig {
  secret: string;
  expires: string;
  refreshSecret: string;
  refreshExpires: string;
  forgotSecret: string;
  forgotExpires: string;
  confirmEmailSecret: string;
  confirmEmailExpires: string;
}

export interface AllConfigType {
  auth: AuthConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  test: {
    test: string;
  };
}

export const databaseConfig = (): { database: DatabaseConfig } => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 8080,
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
});

export const redisConfig = (): { redis: RedisConfig } => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
    keyPrefix: process.env.REDIS_PREFIX_KEY,
  },
});

export const authConfig = (): { auth: AuthConfig } => ({
  auth: {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '15m',
    refreshSecret: process.env.AUTH_REFRESH_SECRET || '',
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  },
});
