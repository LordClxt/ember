import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

/** Logs `METHOD /url 200 - 12ms` for every request, failed ones included. */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const startedAt = Date.now();
    const line = (status: number) =>
      `${request.method} ${request.url} ${status} - ${Date.now() - startedAt}ms`;

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(line(http.getResponse<FastifyReply>().statusCode)),
        error: (error: unknown) => {
          const status =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
          // 5xx stack traces are logged by AllExceptionsFilter.
          if (status >= 500) this.logger.error(line(status));
          else this.logger.warn(line(status));
        },
      }),
    );
  }
}
