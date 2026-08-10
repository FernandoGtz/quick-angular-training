import { Component, inject, OnInit } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-exercises-form.component',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './exercises-form.component.html'
})
export class ExercisesFormComponent implements OnInit {
  // Inyeccion del servicio y el formulario
  private exerciseService = inject(ExerciseService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService);
  private router = inject(Router);

  //Formulario reactivo
  public exerciseForm!: FormGroup;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

  ngOnInit() {
    // Inicializacion del formulario
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
          console.error('Ejercicio no encontrado: ', exercise);
        }
      }).catch((error) => {
        console.error('Error conectando a firestore', error);
      })
    }
  }

  async onSubmit() {
    // Intentamos la creacion de nuevo ejercicio con el formulario validado
    if (this.exerciseForm.valid) {
      try {
        // Llamada al servicio para crear el ejercicio
        const formData = this.exerciseForm.value;

        if (this.isEditMode) {
          await this.exerciseService.updateExercise(this.currentId, this.exerciseForm.value);
          console.log('Actualizado');
        } else {
          const docId = await this.exerciseService.createExercise(formData);
          console.log('Creado: ', docId);
        }
        this.toastService.showToast('Ejercicio guardado correctamente.');
        await this.router.navigate(['/exercises']);
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
