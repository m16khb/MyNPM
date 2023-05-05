//Http Exception
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { UnHandlingException } from '@m16khb/error';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      this.logger.debug(exception);
      exception = new UnHandlingException('알 수 없는 에러', exception);
    }

    const status = (exception as HttpException).getStatus();
    const response = (exception as HttpException).getResponse();
    'production' === process.env.NODE_ENV
      ? this.logger.error(
          {
            url: `${req.url}`,
            message: (response as { code: string; message: string }).message,
            code: (response as { code: string; message: string }).code,
            status: status,
          },
          exception.constructor.name,
        )
      : this.logger.error(
          {
            url: `${req.url}`,
            message: (response as { code: string; message: string }).message,
            code: (response as { code: string; message: string }).code,
            stack: exception.stack,
            status: status,
          },
          null,
          exception.constructor.name,
        );

    res.status(status).json(response);
  }
}
