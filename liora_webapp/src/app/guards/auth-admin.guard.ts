import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  
  if (!auth.isLoggedIn()) {
    router.navigate(['/account'], {
      queryParams: { redirect: state.url }
    });
    return false;
  }

  return true;
};
