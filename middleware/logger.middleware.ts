import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 요청 객체로부터 ip, http method, url, user agent를 받아온 후
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent');
    const sourceIp =
      'local' === process.env.NODE_ENV ? req.ip : req.get('sourceip');

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    res.on('finish', () => {
      if (userAgent !== 'ELB-HealthChecker/2.0') {
        const { statusCode } = res;
        this.logger.log(
          {
            message: `${method} ${originalUrl} ${statusCode} ${sourceIp} ${userAgent}`,
          },
          'COMMON',
        );
      }
    });
    next();
  }
}
