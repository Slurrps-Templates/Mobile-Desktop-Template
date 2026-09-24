// EXAMPLE — replace with your app logic
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface NormalizedHttpError {
  status: number;
  message: string;
  raw: HttpErrorResponse;
}

/** Normalizes HTTP failures into a consistent error shape. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const normalized: NormalizedHttpError = {
          status: err.status,
          message: err.error?.message ?? err.message ?? 'Request failed',
          raw: err,
        };
        return throwError(() => normalized);
      }
      return throwError(() => err);
    }),
  );
};
