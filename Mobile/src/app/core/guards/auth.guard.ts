// EXAMPLE — replace with your app logic
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@app/stores/auth.store';

/** Requires an authenticated session. Attach via `canActivate: [authGuard]` on routes. */
export const authGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (store.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/home']);
};
