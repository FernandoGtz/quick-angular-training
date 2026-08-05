import { Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-exercises-form.component',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './exercises-form.component.html',
  standalone: true,
})
export class ExercisesFormComponent implements OnInit {
  // Inyeccion del servicio y el formulario
  private exerciseServices = inject(ExerciseService);
  private formBuilder = inject(FormBuilder);

  //Formulario reactivo
  public exerciseForm!: FormGroup;

  ngOnInit() {
    // Inicializacion del formulario
    this.exerciseForm = this.formBuilder.group({
      name: ['', Validators.required],
      targetMuscle: ['', Validators.required],
    });
  }

  async onSubmit() {
    // Intentamos la creacion de nuevo ejercicio con el formulario validado
    if (this.exerciseForm.valid) {
      try {
        // Llamada al servicio para crear el ejercicio
        const formData = this.exerciseForm.value;

        const docId = await this.exerciseServices.createExercise(formData);
        console.log('Creado: ', docId);
        this.exerciseForm.reset();
      } catch (error) {
        console.error('Problema al conectar con Firestore', error);
      }
    } else {
      this.exerciseForm.markAllAsTouched();
      console.warn('El formulario tiene errores.');
    }
  }
}
