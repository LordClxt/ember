import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../config/app-config';

/** Single place to plug Sentry/Datadog later. Silent for debug logs in production. */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly production = inject(APP_CONFIG).production;

  debug(message: string, ...data: unknown[]): void {
    if (!this.production) console.debug(`[Ember] ${message}`, ...data);
  }

  info(message: string, ...data: unknown[]): void {
    console.info(`[Ember] ${message}`, ...data);
  }

  error(message: string, ...data: unknown[]): void {
    console.error(`[Ember] ${message}`, ...data);
  }
}
