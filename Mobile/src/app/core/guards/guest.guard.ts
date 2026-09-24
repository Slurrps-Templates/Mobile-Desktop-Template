// EXAMPLE — replace with your app logic
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@app/stores/auth.store';

/** Blocks authenticated users (e.g. login page). Attach via `canActivate: [guestGuard]`. */
export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (!store.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/home']);
};
