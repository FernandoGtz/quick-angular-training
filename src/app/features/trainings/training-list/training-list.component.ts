import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { TrainingView } from '../../../core/models/training.model';
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TrainingService } from '../../../core/services/training.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../layout/confirm-modal/confirm-modal.component';
import { IconComponent } from '../../../layout/icon/icon.component';
import Pencil from 'lucide/dist/esm/icons/pencil.mjs';
import Trash2 from 'lucide/dist/esm/icons/trash-2.mjs';

/*
 * Training list component.
 * Combines the trainings, partners and exercises observables to build a
 * denormalized TrainingView list, and handles the deletion flow through
 * a confirmation modal.
 */
@Component({
  standalone: true,
  selector: 'app-training-list',
  imports: [AsyncPipe, RouterLink, ConfirmModalComponent, IconComponent],
  templateUrl: './training-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingListComponent implements OnInit {
  // Service injection
  private trainingService = inject(TrainingService);
  private partnerService = inject(PartnerService);
  private exerciseService = inject(ExerciseService);
  private toastService = inject(ToastService);

  // Observable of trainings
  public trainingsView$: Observable<TrainingView[]> | undefined;
  public isModalOpen: boolean = false;
  public selectedId: string = '';

  /* Exposed icon references for the template. */
  protected readonly icons = { Pencil, Trash2 } as const;

  /*
   * Builds the TrainingView stream.
   * combineLatest receives an array of observables and each emission is
   * mapped into a readable list where partner ids and exercise ids are
   * replaced with their names.
   */
  ngOnInit() {
    // combineLatest receives an array of observables
    this.trainingsView$ = combineLatest([
      this.trainingService.getTrainings(),
      this.partnerService.getPartners(),
      this.exerciseService.getAllExercises(),
    ]).pipe(
      // map extracts the three resulting arrays in the same order
      map(([trainings, partners, exercises]) => {
        return trainings.map((training) => {
          const foundPartner = partners.find((partner) => partner.id === training.partnerId);

          const exerciseNames = training.exercisesIds.map((exerciseId) => {
            const foundExercise = exercises.find((exercise) => exercise.id === exerciseId);
            return foundExercise ? foundExercise.name : 'Ejercicio eliminado';
          });

          return {
            id: training.id,
            description: training.description,
            partnerName: foundPartner ? foundPartner.name : 'Socio eliminado',
            exerciseNames,
            exerciseNamesLabel: exerciseNames.join(', '),
          };
        });
      }),
    );
  }

  /*
   * Opens the confirmation modal for the training selected to be deleted.
   */
  deleteTraining(id: string): void {
    this.selectedId = id;
    this.isModalOpen = true;
  }

  /*
   * Executes the deletion of the selected training and closes the modal.
   */
  async executeDelete() {
    try {
      await this.trainingService.deleteTraining(this.selectedId);
      this.isModalOpen = false;
      this.toastService.showToast('Entrenamiento eliminado correctamente.');
      this.selectedId = '';
    } catch (error) {
      console.error('Error deleting the training:', error);
    }
  }
}
