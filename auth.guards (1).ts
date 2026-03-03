import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// ─── Guard 1: Any logged-in user ────────────────────────────────────────────
// Protects routes like /dashboard
// Usage in app.routes.ts:  canActivate: [authGuard]
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/auth']);
  return false;
};

// ─── Guard 2: Admin only ─────────────────────────────────────────────────────
// Protects routes like /admin/dashboard
// Usage in app.routes.ts:  canActivate: [adminGuard]
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) return true;

  // Logged in but not admin → send to user dashboard
  if (auth.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Not logged in at all → send to login
  router.navigate(['/auth']);
  return false;
};
