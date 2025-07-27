import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';

dotenv.config({ path: path.join(__dirname, `./.env.dev`) });

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  // url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  cli: {
    migrationsDir: __dirname + '/migrations/**/*{.ts,.js}',
  },
  autoLoadEntities: true,
  synchronize: false,
} as DataSourceOptions);
