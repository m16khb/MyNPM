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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLog = exports.LoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let LoggerInterceptor = class LoggerInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const res = ctx.getResponse();
            const log = {};
            if (Object.keys(req.params).length)
                log.param = req.params;
            if (Object.keys(req.query).length)
                log.query = req.query;
            if (Object.keys(req.body).length)
                log.body = req.body;
            return next.handle().pipe((0, rxjs_1.catchError)((error) => {
                throw error;
            }), (0, rxjs_1.tap)(() => {
                if (this.logger)
                    this.logger.debug(Object.assign(Object.assign({}, res.log), log), res.label);
                else
                    console.log(...res.log, Object.assign({}, log), res.label);
            }));
        });
    }
};
LoggerInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.Logger))
], LoggerInterceptor);
exports.LoggerInterceptor = LoggerInterceptor;
function makeLog(res, methodName, result, label) {
    return __awaiter(this, void 0, void 0, function* () {
        res.log = { message: methodName, result: result };
        res.label = label;
    });
}
exports.makeLog = makeLog;
