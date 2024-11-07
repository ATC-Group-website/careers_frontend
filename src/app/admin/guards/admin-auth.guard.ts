import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const adminService = inject(AdminAuthService);

  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    const token = adminService.getToken(); // Use getToken() to get current token

    if (token !== null) {
      // console.log('inside true');

      // console.log(token);

      return true;
    }
    // console.log('inside false');

    router.navigate(['/admin/login']);
    return false;
  }
  return false;
};
