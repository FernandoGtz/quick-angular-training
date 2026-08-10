import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../layout/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-exercises-list.component',
  imports: [AsyncPipe, RouterLink, ConfirmModalComponent],
  templateUrl: './exercises-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesListComponent implements OnInit {
  // Inyeccion del servicio
  private exerciseService = inject(ExerciseService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Observable para ejercicios
  public isArchivedModalOpen: boolean = false;
  public archivedExercises$: Observable<Exercise[]> | undefined;
  public exercises$: Observable<Exercise[]> | undefined;
  public isModalOpen: boolean = false;
  public selectedId: string = '';

  ngOnInit() {
    // Inicializacion
    this.exercises$ = this.exerciseService.getExercises();
  }

  deleteExercise(id: string): void {
    this.selectedId = id;
    this.isModalOpen = true;
  }

  async executeDelete() {
    try {
      // Invocamos al orquestador del servicio pasándole el ID guardado
      const deletionType = await this.exerciseService.processExerciseDeletion(this.selectedId);

      // Cerramos el modal de confirmación
      this.isModalOpen = false;
      this.selectedId = '';
      this.cdr.markForCheck();

      // Evaluamos la respuesta para disparar el Toast con el mensaje correcto
      if (deletionType === 'SOFT_DELETE') {
        this.toastService.showToast('El ejercicio está en uso. Fue archivado (Soft Delete).');
      } else {
        this.toastService.showToast('El ejercicio fue eliminado definitivamente.');
      }
    } catch (error) {
      console.error('Error al procesar la eliminación del ejercicio:', error);
    }
  }

  openArchivedModal() {
    this.archivedExercises$ = this.exerciseService.getInactiveExercises();
    this.isArchivedModalOpen = true;
  }

  async reactivateExercise(id: string) {
    await this.exerciseService.changeExerciseState(id, true);
    this.toastService.showToast('Ejercicio reactivado correctamente.');
  }
}
