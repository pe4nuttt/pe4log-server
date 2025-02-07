import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  I18nContext,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import { IResponse } from '../interfaces';

@Catch()
export class HttpExceptionFilter extends I18nValidationExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === 500) {
      return response.status(status).json({
        success: false,
        message: 'Internal Server Error',
        errors: exception?.message ?? exception.stack,
        code: response.statusCode,
      } as IResponse);
    }

    const i18n = I18nContext.current();
    formatI18nErrors(exception.errors ?? [], i18n?.service, {
      lang: i18n?.lang,
    });

    const i18Error = this.getErrorMessage(exception.errors);

    response.status(status).json({
      success: false,
      message: exception.message,
      errors: i18Error.length > 0 ? i18Error : exception.getResponse(),
      code: response.statusCode,
    } as IResponse);
  }

  private getErrorMessage(array): string[] {
    if (!array || !array.length) return [];
    const errorMessages = array.map((item) => {
      if (item.children.length > 0) {
        return this.getErrorMessage(item.children);
      } else {
        return Object.values(item.constraints)[0];
      }
    });
    return errorMessages.flat(Infinity);
  }
}
