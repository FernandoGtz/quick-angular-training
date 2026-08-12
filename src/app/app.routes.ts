import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/*
 * Application route table.
 * Defines the public routes (login and sign-up) and the protected
 * dashboard section (guarded by authGuard) with the CRUD routes for
 * trainings, partners and exercises, including their new/edit pages.
 * All feature components are lazy-loaded to keep the initial bundle small.
 * Any unknown path is redirected to the dashboard root.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/sign-up/sign-up.component').then(m => m.SignUpComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'trainings', pathMatch: 'full' },
      // Routes for trainings
      {
        path: 'trainings',
        loadComponent: () => import('./features/trainings/training-list/training-list.component').then(m => m.TrainingListComponent),
      },
      {
        path: 'trainings/new',
        loadComponent: () => import('./features/trainings/training-form/training-form.component').then(m => m.TrainingFormComponent),
      },
      {
        path: 'trainings/edit/:id',
        loadComponent: () => import('./features/trainings/training-form/training-form.component').then(m => m.TrainingFormComponent),
      },
      // Routes for partners
      {
        path: 'partners',
        loadComponent: () => import('./features/partners/partner-list/partner-list.component').then(m => m.PartnerListComponent),
      },
      {
        path: 'partners/new',
        loadComponent: () => import('./features/partners/partner-form/partner-form.component').then(m => m.PartnerFormComponent),
      },
      {
        path: 'partners/edit/:id',
        loadComponent: () => import('./features/partners/partner-form/partner-form.component').then(m => m.PartnerFormComponent),
      },
      // Routes for exercises
      {
        path: 'exercises',
        loadComponent: () => import('./features/exercises/exercises-list.component/exercises-list.component').then(m => m.ExercisesListComponent),
      },
      {
        path: 'exercises/new',
        loadComponent: () => import('./features/exercises/exercises-form.component/exercises-form.component').then(m => m.ExercisesFormComponent),
      },
      {
        path: 'exercises/edit/:id',
        loadComponent: () => import('./features/exercises/exercises-form.component/exercises-form.component').then(m => m.ExercisesFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
