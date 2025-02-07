import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class LocalesService {
  constructor(
    private readonly nestI18nService: I18nService<I18nTranslations>,
  ) {}

  translate(
    key: PathImpl2<I18nTranslations>,
    options?: TranslateOptions,
  ): string {
    if (options) {
      options['lang'] = I18nContext.current().lang;
    }

    return this.nestI18nService.translate(
      key,
      options || {
        lang: I18nContext.current()?.lang,
      },
    );
  }
}
