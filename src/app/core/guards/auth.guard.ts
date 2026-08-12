import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

/*
 * Route guard that protects the dashboard section.
 * Checks the current Firebase auth state and allows navigation only
 * when a user is authenticated; otherwise it redirects to the login page.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map((user) => {
      // Evaluate whether the user object is authenticated
      if (user) {
        // If so, keep the navigation
        return true;
      } else {
        // If not, redirect the user to the login page
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};
