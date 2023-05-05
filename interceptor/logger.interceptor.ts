import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Response } from 'express';

export type LogResponse = Response & { log: any; label: string };

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const log: { param?: any; query?: any; body?: any } = {};
    if (Object.keys(req.params).length) log.param = req.params;
    if (Object.keys(req.query).length) log.query = req.query;
    if (Object.keys(req.body).length) log.body = req.body;
    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
      tap(() => {
        if (this.logger) this.logger.debug({ ...res.log, ...log }, res.label);
        else console.log(...res.log,{...log},res.label);
      }),
    );
  }
}

export async function makeLog(
  res: LogResponse,
  methodName: string,
  result: any,
  label: string,
): Promise<void> {
  res.log = { message: methodName, result: result };
  res.label = label;
}
