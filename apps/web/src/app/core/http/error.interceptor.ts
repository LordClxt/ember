import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/paginated.model';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';

/** Centralised HTTP error handling: log + user notification, then rethrow. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as Partial<ApiError> | null;
      const message =
        error.status === 0
          ? 'Unable to reach the server.'
          : [apiError?.message ?? error.message].flat().join(', ');

      logger.error(`HTTP ${error.status} ${req.method} ${req.url}`, error);
      notifications.error(message);
      return throwError(() => error);
    }),
  );
};
