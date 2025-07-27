import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  authFacebookConfig,
  authGithubConfig,
  authGoogleConfig,
  databaseConfig,
  redisConfig,
} from './config/configuration.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsController } from './modules/tags/tags.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { RedisModule } from './services/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocalesModule } from './services/i18n/i18n.module';
import { FilesModule } from './files/files.module';
import { SessionModule } from './modules/session/session.module';
import { PostsModule } from './modules/posts/posts.module';
import * as Joi from 'joi';
import { TagsModule } from './modules/tags/tags.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { HocuspocusModule } from './hocuspocus/hocuspocus.module';
import { SyncModule } from './sync/sync.module';
import { UserProvidersModule } from './modules/user-providers/user-providers.module';
import { MailModule } from './modules/mail/mail.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { AiModule } from './modules/ai/ai.module';
import { LoginAttemptsModule } from './modules/login-attempts/login-attempts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CommentReactionsModule } from './modules/comment-reactions/comment-reactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        authConfig,
        authGoogleConfig,
        authGithubConfig,
        authFacebookConfig,
      ],
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
    PostsModule,
    TagsModule,
    CloudinaryModule,
    HocuspocusModule,
    SyncModule,
    UserProvidersModule,
    MailModule,
    NewsletterModule,
    AiModule,
    LoginAttemptsModule,
    CommentsModule,
    CommentReactionsModule,
  ],
  controllers: [AppController, TagsController, CommentsController],
  providers: [AppService],
})
export class AppModule {}
