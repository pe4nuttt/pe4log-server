import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  authConfig,
  databaseConfig,
  redisConfig,
} from './config/configuration.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PostsController } from './modules/posts/posts.controller';
import { TagsController } from './modules/tags/tags.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { RedisModule } from './services/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocalesModule } from './services/i18n/i18n.module';
import { FilesModule } from './files/files.module';
import { SessionModule } from './modules/session/session.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [databaseConfig, redisConfig, authConfig],
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision', 'staging')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    DatabaseModule,
    UsersModule,
    CategoriesModule,
    RedisModule,
    AuthModule,
    LocalesModule,
    FilesModule,
    SessionModule,
  ],
  controllers: [
    AppController,
    PostsController,
    TagsController,
    CommentsController,
  ],
  providers: [AppService],
})
export class AppModule {}
