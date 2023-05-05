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
exports.TransactionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
let TransactionInterceptor = class TransactionInterceptor {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    intercept(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const queryRunner = yield this.dbInit();
            req.queryRunner = queryRunner;
            return next.handle().pipe((0, rxjs_1.catchError)((error) => __awaiter(this, void 0, void 0, function* () {
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                throw error;
            })), (0, rxjs_1.tap)(() => __awaiter(this, void 0, void 0, function* () {
                if ('Y' === req.get('dry-run')) {
                    yield queryRunner.rollbackTransaction();
                    yield queryRunner.release();
                }
                else {
                    yield queryRunner.commitTransaction();
                    yield queryRunner.release();
                }
            })));
        });
    }
    dbInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.dataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            return queryRunner;
        });
    }
};
TransactionInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)())
], TransactionInterceptor);
exports.TransactionInterceptor = TransactionInterceptor;
