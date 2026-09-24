import { Routes } from '@angular/router';
import { authGuard, guestGuard, profileCompleteGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((m) => m.Home)
  },
  {
    path: 'impressum',
    loadComponent: () => import('./impressum/impressum').then((m) => m.Impressum)
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./kontakt/kontakt').then((m) => m.Kontakt)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./register/register').then((m) => m.Register)
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile-setup/profile-setup').then((m) => m.ProfileSetup)
  },
  {
    path: 'exercises',
    canActivate: [authGuard, profileCompleteGuard],
    loadComponent: () =>
      import('./exercises/exercise-list/exercise-list').then((m) => m.ExerciseList)
  },
  {
    path: 'exercises/new',
    canActivate: [authGuard, profileCompleteGuard],
    loadComponent: () =>
      import('./exercises/exercise-create/exercise-create').then((m) => m.ExerciseCreate)
  },
  {
    path: 'exercises/:id',
    canActivate: [authGuard, profileCompleteGuard],
    loadComponent: () =>
      import('./exercises/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail)
  },
  {
    path: 'exercises/:id/edit',
    canActivate: [authGuard, profileCompleteGuard],
    loadComponent: () =>
      import('./exercises/exercise-edit/exercise-edit').then((m) => m.ExerciseEdit)
  },
  {
    path: 'exercises/:id/delete',
    canActivate: [authGuard, profileCompleteGuard],
    loadComponent: () =>
      import('./exercises/exercise-delete/exercise-delete').then((m) => m.ExerciseDelete)
  },
  { path: '**', redirectTo: '' }
];
