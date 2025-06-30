import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: configService.get<string>('DATABASE_TYPE'),
        // url: configService.get<string>('DATABASE_URL'),
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/database/migrations/**/*{.ts,.js}',
        },
      } as DataSourceOptions);

      return dataSource.initialize();
    },
  },
];
