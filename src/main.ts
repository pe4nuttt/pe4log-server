import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters';
import { TransformInterceptor } from './utils/interceptors';
import { configSwagger } from './config/api-docs.config';
import validationOptions from './utils/validation-options';
import { WsAdapter } from '@nestjs/platform-ws';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/configuration.config';
import * as cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
// import { DatabaseConfig } from './config/configuration.config';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser.default());
  app.use(morgan('tiny'));
  configSwagger(app);
  const configService: ConfigService<AllConfigType> = app.get(ConfigService);
  // const logger = new Logger(bootstrap.name);
  // const database_env = configService.get<DatabaseConfig>('database');
  // logger.debug(database_env);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(
    configService.getOrThrow('app.port', {
      infer: true,
    }),
  );
}
bootstrap();
