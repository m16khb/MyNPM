import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, tap } from 'rxjs';
import { QueryRunner, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export type RequestQueryRunner = Request & { queryRunner: QueryRunner };

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req: RequestQueryRunner = ctx.getRequest();
    const queryRunner: QueryRunner = await this.dbInit();

    req.queryRunner = queryRunner;

    return next.handle().pipe(
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        throw error;
      }),
      tap(async () => {
        if ('Y' === req.get('dry-run')) {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
        } else {
          await queryRunner.commitTransaction();
          await queryRunner.release();
        }
      }),
    );
  }

  private async dbInit(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
