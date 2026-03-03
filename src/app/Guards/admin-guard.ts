import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/authService';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if logged in AND role is strictly 'admin'
  if (authService.isLoggedIn() && authService.getRole() === 'admin') {
    return true;
  }

  // 2. If they fail the check, kick them back to their own dashboard or home
  router.navigate(['/dashboard']);
  return false;
};
