import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/configuration.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<AllConfigType>) => ({
        transport: {
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'tienanh1512@gmail.com',
            clientId: configService.getOrThrow('authGoogle.clientId', {
              infer: true,
            }),
            clientSecret: configService.getOrThrow('authGoogle.clientSecret', {
              infer: true,
            }),
            refreshToken: configService.getOrThrow('authGoogle.refreshToken', {
              infer: true,
            }),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
