"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
//Http Exception
const common_1 = require("@nestjs/common");
const error_1 = require("@m16khb/error");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        if (!(exception instanceof common_1.HttpException)) {
            this.logger.debug(exception);
            exception = new error_1.UnHandlingException('알 수 없는 에러', exception);
        }
        const status = exception.getStatus();
        const response = exception.getResponse();
        'production' === process.env.NODE_ENV
            ? this.logger.error({
                url: `${req.url}`,
                message: response.message,
                code: response.code,
                status: status,
            }, exception.constructor.name)
            : this.logger.error({
                url: `${req.url}`,
                message: response.message,
                code: response.code,
                stack: exception.stack,
                status: status,
            }, null, exception.constructor.name);
        res.status(status).json(response);
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(common_1.Logger))
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
