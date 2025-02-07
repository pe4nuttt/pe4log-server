import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { LocalesService } from './i18n.service';
import { ELang } from 'src/utils/enums';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: ELang.EN,
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../../../src/generated/i18n.generated.ts',
      ),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [LocalesService],
  exports: [LocalesService],
})
export class LocalesModule {}
