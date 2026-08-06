import { Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-exercises-list.component',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './exercises-list.component.html'
})
export class ExercisesListComponent implements OnInit {
  // Inyeccion del servicio
  private exercisesService = inject(ExerciseService);

  // Observable para ejercicios
  public exercises$: Observable<Exercise[]> | undefined;

  ngOnInit() {
    // Inicializacion
    this.exercises$ = this.exercisesService.getExercises();
  }

  async deleteExercise(id: string): Promise<void> {
    const confirm = window.confirm('¿Estás seguro de borrar este ejercicio?');

    if (confirm) {
      try {
        this.exercisesService.deleteExercise(id);
        console.log('Ejercicio eliminado');
      } catch (error) {
        console.log('Error al borrar el ejercicio: ', error);
      }
    }
  }
}
