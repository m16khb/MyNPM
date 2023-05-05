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
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggerMiddleware = class LoggerMiddleware {
    constructor(logger) {
        this.logger = logger;
    }
    use(req, res, next) {
        // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
        const { method, originalUrl } = req;
        const userAgent = req.get('user-agent');
        const sourceIp = 'local' === process.env.NODE_ENV ? req.ip : req.get('sourceip');
        // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
        res.on('finish', () => {
            if (userAgent !== 'ELB-HealthChecker/2.0') {
                const { statusCode } = res;
                this.logger.log({
                    message: `${method} ${originalUrl} ${statusCode} ${sourceIp} ${userAgent}`,
                }, 'COMMON');
            }
        });
        next();
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.Logger))
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
