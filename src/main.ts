import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
// import { DatabaseConfig } from './config/configuration.config';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const configService = app.get(ConfigService);
  // const logger = new Logger(bootstrap.name);
  // const database_env = configService.get<DatabaseConfig>('database');
  // logger.debug(database_env);
  await app.listen(3000);
}
bootstrap();
