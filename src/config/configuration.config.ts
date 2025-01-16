export interface DatabaseConfig {
  url?: string;
  type: string;
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export const databaseConfig = (): { database: DatabaseConfig } => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 8080),
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
});
