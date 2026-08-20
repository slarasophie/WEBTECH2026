import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'exercises' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: 'exercises',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/exercises/exercise-list/exercise-list').then((m) => m.ExerciseList)
  },
  {
    path: 'exercises/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/exercises/exercise-create/exercise-create').then((m) => m.ExerciseCreate)
  },
  {
    path: 'exercises/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/exercises/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail)
  },
  {
    path: 'exercises/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/exercises/exercise-edit/exercise-edit').then((m) => m.ExerciseEdit)
  },
  {
    path: 'exercises/:id/delete',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/exercises/exercise-delete/exercise-delete').then((m) => m.ExerciseDelete)
  },
  { path: '**', redirectTo: 'exercises' }
];
