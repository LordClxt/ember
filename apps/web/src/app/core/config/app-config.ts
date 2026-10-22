import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
}

/** Inject runtime config instead of importing `environment` everywhere (easier to mock). */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => environment,
});
