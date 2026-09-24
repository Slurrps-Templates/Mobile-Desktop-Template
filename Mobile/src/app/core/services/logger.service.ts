import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(message: string, ...args: unknown[]): void {
    if (!environment.production && environment.enableDebugLogging) {
      console.debug(`[debug] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (environment.enableDebugLogging || !environment.production) {
      console.info(`[info] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[warn] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[error] ${message}`, ...args);
  }
}
