import { Module } from '@nestjs/common';
// import { databaseProviders } from './database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  // providers: [...databaseProviders],
  // exports: [...databaseProviders],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<string>('DATABASE_TYPE'),
          // url: configService.get<string>('DATABASE_URL'),
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
          migrationsRun: true,
          cli: {
            migrationsDir: __dirname + '/database/migrations/**/*{.ts,.js}',
          },
          // synchronize: configService.get('DATABASE_SYNCHRONIZE', {
          //   infer: true,
          // }),
          synchronize: false,
          logging: ['query', 'error'],
        } as DataSourceOptions;
      },
      dataSourceFactory: async (options) => {
        // const dataSource = await new DataSource(options).initialize();
        // return dataSource;
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
