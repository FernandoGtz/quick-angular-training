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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'trainings', pathMatch: 'full' },
      // Rutas para entrenamientos
      { path: 'trainings', component: TrainingListComponent },
      { path: 'trainings/new', component: TrainingFormComponent },
      { path: 'trainings/edit/:id', component: TrainingFormComponent },

      // Rutas para socios
      { path: 'partners', component: PartnerListComponent },
      { path: 'partners/new', component: PartnerFormComponent },
      { path: 'partners/edit/:id', component: PartnerFormComponent },

      // Rutas para ejercicios
      { path: 'exercises', component: ExercisesListComponent },
      { path: 'exercises/new', component: ExercisesFormComponent },
      { path: 'exercises/edit/:id', component: ExercisesFormComponent },
    ],
  },
  { path: '**', redirectTo: 'partners' },
];
