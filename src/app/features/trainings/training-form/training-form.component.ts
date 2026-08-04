import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingService } from '../../../core/services/training.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Partner } from '../../../core/models/partner.model';
import { ExerciseService } from '../../../core/services/exercise.service';
import { PartnerService } from '../../../core/services/partner.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  imports: [ReactiveFormsModule, AsyncPipe],
  standalone: true,
})
export class TrainingFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private trainingService = inject(TrainingService);
  private exerciseService = inject(ExerciseService);
  private partnerService = inject(PartnerService);

  public trainingForm!: FormGroup;
  public exercises$: Observable<Exercise[]> | undefined;
  public partners$: Observable<Partner[]> | undefined;

  ngOnInit() {
    this.trainingForm = this.formBuilder.group({
      partnerId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      exercisesIds: [[], Validators.required],
    });
    this.exercises$ = this.exerciseService.getExercises();
    this.partners$ = this.partnerService.getPartners();
  }

  async onSubmit() {
    // Intentamos la creacion de un entrenamiento con el formulario validado
    if (this.trainingForm.valid) {
      try {
        // Llamada al servicio para crear el entrenamiento
        const formData = this.trainingForm.value;

        // Asignamos la fecha de creacion al payload
        const createdAt = new Date();
        const payload = { ...formData, createdAt };
        const docId = await this.trainingService.createTraining(payload);

        console.log('Creado', docId);
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
