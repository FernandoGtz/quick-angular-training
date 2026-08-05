import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map((user) => {
      // Evaluamos si el objeto user esta autenticado
      if (user) {
        // Si es asi lo mantenemos
        return true;
      } else {
        // Si no, lo redirigimos al login
        router.navigate(['/login']);
        return false;
      }
    }),
  );
};
