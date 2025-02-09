import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters';
import { TransformInterceptor } from './utils/interceptors';
import { configSwagger } from './config/api-docs.config';
// import { ConfigService } from '@nestjs/config';
// import { DatabaseConfig } from './config/configuration.config';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configSwagger(app);
  // const configService = app.get(ConfigService);
  // const logger = new Logger(bootstrap.name);
  // const database_env = configService.get<DatabaseConfig>('database');
  // logger.debug(database_env);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
