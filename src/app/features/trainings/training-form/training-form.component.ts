import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingService } from '../../../core/services/training.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Partner } from '../../../core/models/partner.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { PartnerService } from '../../../core/services/partner.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Training } from '../../../core/models/training.model';

@Component({
  standalone: true,
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  imports: [ReactiveFormsModule, AsyncPipe],
})
export class TrainingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private exerciseService = inject(ExerciseService);
  private partnerService = inject(PartnerService);
  private route = inject(ActivatedRoute)

  public trainingForm!: FormGroup;
  public exercises$: Observable<Exercise[]> | undefined;
  public partners$: Observable<Partner[]> | undefined;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

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
          console.error('Entrenamiento no encontrado.');
        }
      }).catch((error) => {
        console.error('Error conectando a firestore', error)
      })
    }
  }

  async onSubmit() {
    // Intentamos la creacion de un entrenamiento con el formulario validado
    if (this.trainingForm.valid) {
      try {
        // Llamada al servicio para crear el entrenamiento
        const formData = this.trainingForm.value;

        if (this.isEditMode) {
          // Se realiza la actualizacion del documento partiendo del id y los valores del formulario
          await this.trainingService.updateTraining(this.currentId, this.trainingForm.value);
          console.log('Actualizado: ');
        } else {
          // Asignamos la fecha de creacion al payload
          const createdAt = new Date();
          const payload = { ...formData, createdAt };
          const docId = await this.trainingService.createTraining(payload);

          console.log('Creado: ', docId);
        }
        // Limpiamos el formulario
        this.trainingForm.reset();
      } catch (error) {
        console.error('Problema al contactar con Firestore:', error);
      }
    } else {
      this.trainingForm.markAllAsTouched();
      console.warn('El formulario tiene errores.');
    }
  }
}
