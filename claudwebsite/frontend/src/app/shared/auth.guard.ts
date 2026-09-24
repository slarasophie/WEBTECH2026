import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/exercises']);
  return false;
};

// Erzwingt, dass das Registrierungsprofil (Alter/Gewicht/Größe/Ziel) einmalig ausgefüllt wird,
// bevor auf die Übungen zugegriffen werden kann.
export const profileCompleteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.currentUser()?.profileCompleted) {
    return true;
  }

  router.navigate(['/profil']);
  return false;
};
