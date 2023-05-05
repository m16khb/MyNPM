import { HttpException, HttpStatus } from '@nestjs/common';

const INTERNAL_SERVER_ERROR = HttpStatus.INTERNAL_SERVER_ERROR;

export class InternalServerErrorException extends HttpException {
  constructor(Record: string | Record<string, any>, cause: Error | undefined) {
    super(Record, INTERNAL_SERVER_ERROR);
    this.cause = cause;
  }
}
export class UnHandlingException extends InternalServerErrorException {
  constructor(message: string, cause?: Error) {
    super({ code: 9999, message: message }, cause);
  }
}
export class DBException extends InternalServerErrorException {
  constructor(message: string, cause?: Error) {
    super({ code: 9999, message: message }, cause);
  }
}
