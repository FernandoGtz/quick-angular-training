import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingService } from '../../../core/services/training.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Partner } from '../../../core/models/partner.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { PartnerService } from '../../../core/services/partner.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Training } from '../../../core/models/training.model';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../layout/icon/icon.component';
import Save from 'lucide/dist/esm/icons/save.mjs';

/*
 * Training form component.
 * Provides a reactive form to create and edit trainings. It loads the
 * active exercises and partners for the selects and, in edit mode,
 * pre-fills the form with the existing training data.
 */
@Component({
  standalone: true,
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  imports: [ReactiveFormsModule, AsyncPipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private exerciseService = inject(ExerciseService);
  private partnerService = inject(PartnerService);
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService);
  private router = inject(Router);

  public trainingForm!: FormGroup;
  public exercises$: Observable<Exercise[]> | undefined;
  public partners$: Observable<Partner[]> | undefined;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

  /* Exposed icon reference for the template. */
  protected readonly Save = Save;

  /* Shortcuts to the form controls used in the template. */
  get descriptionCtrl() { return this.trainingForm.get('description')!; }
  get exercisesIdsCtrl() { return this.trainingForm.get('exercisesIds')!; }
  get partnerIdCtrl() { return this.trainingForm.get('partnerId')!; }

  /*
   * Initializes the form, loads the available exercises and partners,
   * and in edit mode pre-fills the form with the training data.
   */
  ngOnInit() {
    this.trainingForm = this.formBuilder.group({
      partnerId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      exercisesIds: [[], Validators.required],
    });
    this.currentId = this.route.snapshot.paramMap.get('id');
    this.exercises$ = this.exerciseService.getExercises();
    this.partners$ = this.partnerService.getPartners();
    if (this.currentId) {
      this.isEditMode = true;
      this.trainingService.getTrainingById(this.currentId).then((training: Training) => {
        if (training) {
          this.trainingForm.patchValue(training);
        } else {
          console.error('Training not found.');
        }
      }).catch((error) => {
        console.error('Error connecting to Firestore', error)
      })
    }
  }

  /*
   * Handles the form submission.
   * Updates the existing training in edit mode or creates a new one
   * (adding the creation date), then redirects to the trainings list.
   */
  async onSubmit() {
    // Try to create a training with the validated form
    if (this.trainingForm.valid) {
      try {
        // Call the service to create the training
        const formData = this.trainingForm.value;

        if (this.isEditMode) {
          // Update the document using the id and the form values
          await this.trainingService.updateTraining(this.currentId, this.trainingForm.value);
          console.log('Updated.');
        } else {
          // Assign the creation date to the payload
          const createdAt = new Date();
          const payload = { ...formData, createdAt };
          const docId = await this.trainingService.createTraining(payload);

          console.log('Created: ', docId);
        }
        this.toastService.showToast('Entrenamiento guardado correctamente.');
        // Clear the form
        this.trainingForm.reset();
        await this.router.navigate(['/trainings']);
      } catch (error) {
        console.error('Problem contacting Firestore:', error);
      }
    } else {
      this.trainingForm.markAllAsTouched();
      console.warn('The form has errors.');
    }
  }
}
