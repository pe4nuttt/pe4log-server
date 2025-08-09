export interface AppConfig {
  port: number;
}

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
  clientCallbackUrl: string;
}

export interface AuthGoogleConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  refreshToken: string;
}

export interface AuthGithubConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface AuthFacebookConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface AllConfigType {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  authGoogle: AuthGoogleConfig;
  authGithub: AuthGithubConfig;
  authFacebook: AuthFacebookConfig;
  appSetting: AppSettingConfig;
  test: {
    test: string;
  };
}

export interface AppSettingConfig {
  newsletter: {
    timezone: string;
    time: string;
  };
}

export const appConfig = (): { app: AppConfig } => ({
  app: {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 8080,
  },
});
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
    clientCallbackUrl: process.env.AUTH_FRONTEND_URL,
  },
});

export const authGoogleConfig = (): { authGoogle: AuthGoogleConfig } => ({
  authGoogle: {
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.AUTH_GOOGLE_CALLBACK_URL,
    refreshToken: process.env.AUTH_GOOGLE_REFRESH_TOKEN,
  },
});

export const authGithubConfig = (): { authGithub: AuthGithubConfig } => ({
  authGithub: {
    clientId: process.env.AUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.AUTH_GITHUB_CALLBACK_URL,
  },
});

export const authFacebookConfig = (): { authFacebook: AuthFacebookConfig } => ({
  authFacebook: {
    clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
    callbackUrl: process.env.AUTH_FACEBOOK_CALLBACK_URL,
  },
});

export const appSettingConfig = (): { appSetting: AppSettingConfig } => ({
  appSetting: {
    newsletter: {
      timezone:
        process.env.APP_SETTING_NEWSLETTER_TIMEZONE || 'Asia/Ho_Chi_Minh',
      time: process.env.APP_SETTING_NEWSLETTER_TIME || '08:00',
    },
  },
});
