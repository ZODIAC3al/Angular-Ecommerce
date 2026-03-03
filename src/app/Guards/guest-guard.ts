import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/authService';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is ALREADY logged in, redirect them away from the auth page
  if (authService.isLoggedIn()) {
    const target = authService.isAdmin() ? '/admin/dashboard' : '/';
    router.navigate([target]);
    return false;
  }

  return true;
};
