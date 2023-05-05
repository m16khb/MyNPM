"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBException = exports.UnHandlingException = exports.InternalServerErrorException = void 0;
const common_1 = require("@nestjs/common");
const INTERNAL_SERVER_ERROR = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
class InternalServerErrorException extends common_1.HttpException {
    constructor(Record, cause) {
        super(Record, INTERNAL_SERVER_ERROR);
        this.cause = cause;
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class UnHandlingException extends InternalServerErrorException {
    constructor(message, cause) {
        super({ code: 9999, message: message }, cause);
    }
}
exports.UnHandlingException = UnHandlingException;
class DBException extends InternalServerErrorException {
    constructor(message, cause) {
        super({ code: 9999, message: message }, cause);
    }
}
exports.DBException = DBException;
