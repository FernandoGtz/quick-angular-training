import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../layout/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../layout/icon/icon.component';
import Archive from 'lucide/dist/esm/icons/archive.mjs';
import Pencil from 'lucide/dist/esm/icons/pencil.mjs';
import RotateCcw from 'lucide/dist/esm/icons/rotate-ccw.mjs';
import Trash2 from 'lucide/dist/esm/icons/trash-2.mjs';
import X from 'lucide/dist/esm/icons/x.mjs';

/*
 * Exercises list component.
 * Displays the active exercises and handles deletion through a
 * confirmation modal. Deletion is orchestrated by the service, which
 * decides between a soft delete (archiving) and a hard delete. It also
 * provides a modal to view and reactivate archived exercises.
 */
@Component({
  standalone: true,
  selector: 'app-exercises-list.component',
  imports: [AsyncPipe, RouterLink, ConfirmModalComponent, IconComponent],
  templateUrl: './exercises-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesListComponent implements OnInit {
  // Service injection
  private exerciseService = inject(ExerciseService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Observables for exercises
  public isArchivedModalOpen: boolean = false;
  /* Shared stream so opening the modal multiple times does not recreate the
   * Firestore listener every time. */
  public archivedExercises$: Observable<Exercise[]> = this.exerciseService.getInactiveExercises().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  public exercises$: Observable<Exercise[]> | undefined;
  public isModalOpen: boolean = false;
  public selectedId: string = '';

  /* Exposed icon references for the template. */
  protected readonly icons = { Archive, Pencil, RotateCcw, Trash2, X } as const;

  /* Initializes the observable of active exercises. */
  ngOnInit() {
    // Initialization
    this.exercises$ = this.exerciseService.getExercises();
  }

  /*
   * Opens the confirmation modal for the exercise selected to be deleted.
   */
  deleteExercise(id: string): void {
    this.selectedId = id;
    this.isModalOpen = true;
  }

  /*
   * Executes the deletion of the selected exercise through the service
   * orchestrator and shows a toast with the applied strategy.
   */
  async executeDelete() {
    try {
      // Invoke the service orchestrator passing the stored id
      const deletionType = await this.exerciseService.processExerciseDeletion(this.selectedId);

      // Close the confirmation modal
      this.isModalOpen = false;
      this.selectedId = '';
      this.cdr.markForCheck();

      // Evaluate the response to trigger the toast with the right message
      if (deletionType === 'SOFT_DELETE') {
        this.toastService.showToast('El ejercicio está en uso. Fue archivado (Soft Delete).');
      } else {
        this.toastService.showToast('El ejercicio fue eliminado definitivamente.');
      }
    } catch (error) {
      console.error('Error processing the exercise deletion:', error);
    }
  }

  /*
   * Opens the archived exercises modal.
   * The observable is created once and shared via shareReplay.
   */
  openArchivedModal() {
    this.isArchivedModalOpen = true;
  }

  /*
   * Reactivates an archived exercise by setting its state to active.
   */
  async reactivateExercise(id: string) {
    await this.exerciseService.changeExerciseState(id, true);
    this.toastService.showToast('Ejercicio reactivado correctamente.');
  }
}
