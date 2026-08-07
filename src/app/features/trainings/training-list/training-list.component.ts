import { Component, inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { TrainingView } from '../../../core/models/training.model';
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TrainingService } from '../../../core/services/training.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-training-list',
  imports: [AsyncPipe, RouterLink, ],
  templateUrl: './training-list.component.html',
})
export class TrainingListComponent implements OnInit {
  // Inyeccion del servicio
  private trainingService = inject(TrainingService);
  private partnerService = inject(PartnerService);
  private exerciseService = inject(ExerciseService);

  // Observable de trainings
  public trainingsView$: Observable<TrainingView[]> | undefined;

  ngOnInit() {
    // combineLatest recibe un arreglo de observables
    this.trainingsView$ = combineLatest([
      this.trainingService.getTrainings(),
      this.partnerService.getPartners(),
      this.exerciseService.getAllExercises(),
    ]).pipe(
      // El map extrae los tres arreglos resultantes en el mismo orden
      map(([trainings, partners, exercises]) => {
        return trainings.map((training) => {
          const partnerEncontrado = partners.find((partner) => partner.id === training.partnerId);

          const nombresEjercicios = training.exercisesIds.map((exerciseId) => {
            const exerciseEncontrado = exercises.find((exercise) => exercise.id === exerciseId);
            return exerciseEncontrado ? exerciseEncontrado.name : 'Ejercicio eliminado';
          });

          return {
            id: training.id,
            description: training.description,
            partnerName: partnerEncontrado ? partnerEncontrado.name : 'Socio eliminado',
            exerciseNames: nombresEjercicios,
          };
        });
      }),
    );
  }

  async deleteTraining(id: string){
    const confirm = window.confirm('¿Estás seguro de borrar este entrenamiento?');

    if (confirm) {
      try {
        await this.trainingService.deleteTraining(id);
        console.log('Eliminado');
      } catch (error) {
        console.log('Error al borrar el entrenamiento: ', error);
      }
    }
  }
}
