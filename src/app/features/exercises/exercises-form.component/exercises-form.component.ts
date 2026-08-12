import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../layout/icon/icon.component';
import Save from 'lucide/dist/esm/icons/save.mjs';

/*
 * Exercises form component.
 * Provides a reactive form to create and edit exercises. In edit mode it
 * loads the existing exercise data and submits create/update operations
 * to the ExerciseService.
 */
@Component({
  standalone: true,
  selector: 'app-exercises-form.component',
  imports: [ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './exercises-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesFormComponent implements OnInit {
  // Injection of the service and the form
  private exerciseService = inject(ExerciseService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Reactive form
  public exerciseForm!: FormGroup;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

  /* Exposed icon reference for the template. */
  protected readonly Save = Save;

  /* Shortcuts to the form controls used in the template. */
  get nameCtrl() { return this.exerciseForm.get('name')!; }
  get targetMuscleCtrl() { return this.exerciseForm.get('targetMuscle')!; }

  /*
   * Initializes the form and, when an id is present in the route,
   * switches to edit mode and pre-fills the form with the exercise data.
   */
  ngOnInit() {
    // Form initialization
    this.exerciseForm = this.formBuilder.group({
      name: ['', Validators.required],
      targetMuscle: ['', Validators.required],
    });
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.isEditMode = true;
      this.exerciseService.getExerciseById(this.currentId).then((exercise: Exercise) => {
        if (exercise) {
          this.exerciseForm.patchValue(exercise);
        } else {
          console.error('Exercise not found: ', exercise);
        }
      }).catch((error) => {
        console.error('Error connecting to Firestore', error);
      })
    }
  }

  /*
   * Handles the form submission.
   * Updates the existing exercise in edit mode or creates a new one,
   * then redirects to the exercises list.
   */
  async onSubmit() {
    // Try to create a new exercise with the validated form
    if (this.exerciseForm.valid) {
      try {
        // Call the service to create the exercise
        const formData = this.exerciseForm.value;

        if (this.isEditMode) {
          await this.exerciseService.updateExercise(this.currentId, this.exerciseForm.value);
          console.log('Updated');
        } else {
          const docId = await this.exerciseService.createExercise(formData);
          console.log('Created: ', docId);
        }
        this.toastService.showToast('Ejercicio guardado correctamente.');
        await this.router.navigate(['/exercises']);
        this.exerciseForm.reset();
      } catch (error) {
        console.error('Problem connecting to Firestore', error);
      }
    } else {
      this.exerciseForm.markAllAsTouched();
      console.warn('The form has errors.');
    }
  }
}
