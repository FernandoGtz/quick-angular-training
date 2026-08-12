import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { PartnerListComponent } from './features/partners/partner-list/partner-list.component';
import { PartnerFormComponent } from './features/partners/partner-form/partner-form.component';
import { TrainingListComponent } from './features/trainings/training-list/training-list.component';
import { TrainingFormComponent } from './features/trainings/training-form/training-form.component';
import { ExercisesListComponent } from './features/exercises/exercises-list.component/exercises-list.component';
import { ExercisesFormComponent } from './features/exercises/exercises-form.component/exercises-form.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { SignUpComponent } from './features/sign-up/sign-up.component';

/*
 * Application route table.
 * Defines the public routes (login and sign-up) and the protected
 * dashboard section (guarded by authGuard) with the CRUD routes for
 * trainings, partners and exercises, including their new/edit pages.
 * Any unknown path is redirected to the dashboard root.
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'trainings', pathMatch: 'full' },
      // Routes for trainings
      { path: 'trainings', component: TrainingListComponent },
      { path: 'trainings/new', component: TrainingFormComponent },
      { path: 'trainings/edit/:id', component: TrainingFormComponent },

      // Routes for partners
      { path: 'partners', component: PartnerListComponent },
      { path: 'partners/new', component: PartnerFormComponent },
      { path: 'partners/edit/:id', component: PartnerFormComponent },

      // Routes for exercises
      { path: 'exercises', component: ExercisesListComponent },
      { path: 'exercises/new', component: ExercisesFormComponent },
      { path: 'exercises/edit/:id', component: ExercisesFormComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
