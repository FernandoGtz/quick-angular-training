import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);
  private toastService = inject(ToastService);

  public signUpForm!: FormGroup;
  public errorMessage: string = '';

  ngOnInit() {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [passwordMatchValidator]
    });
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      try {
        const { email, password } = this.signUpForm.value;

        const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);

        // Si generamos un usuario, entonces mandamos un correo de confirmacion
        if (userCredentials.user) {
          await sendEmailVerification(userCredentials.user);
        }

        // Redirigimos al login al realizar el registo y confirmamos al usuario su operacion
        this.toastService.showToast('Cuenta creada con éxito. Revisa tu correo para verificar.');
        await this.router.navigate(['/login']);
        console.log('Usuario creado. Correo de verificación enviado.');
      } catch (error: any) {
        // Manejo de errores de Firebase (ej. 'auth/email-already-in-use')
        console.error('Error en registro:', error);
        // Manejo de códigos comunes de Firebase Auth
        if (error.code === 'auth/email-already-in-use') this.errorMessage = 'Este correo electrónico ya se encuentra registrado.';
        else if (error.code === 'auth/weak-password') this.errorMessage = 'La contraseña es demasiado débil.';
        else this.errorMessage = 'Ocurrió un error al intentar crear la cuenta.';
      }
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  get passwordValue(): string { return this.signUpForm.get('password')?.value || ''; }

  get isMinLengthValid(): boolean { return hasMinLength(this.passwordValue); }

  get isNumberValid(): boolean { return hasNumber(this.passwordValue); }

  get isSpecialCharValid(): boolean { return hasSpecialChar(this.passwordValue); }

  get doPasswordsMatch(): boolean {
    const pass = this.signUpForm.get('password')?.value;
    const confirm = this.signUpForm.get('confirmPassword')?.value;
    return pass && confirm && pass === confirm;
  }

  // Bandera general para habilitar/deshabilitar el botón
  get isFormReady(): boolean {
    return this.isMinLengthValid &&
      this.isNumberValid &&
      this.isSpecialCharValid &&
      this.doPasswordsMatch &&
      this.signUpForm.get('email')?.valid;
  }
}

// Función validadora que recibe el formulario completo
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Si ambos campos existen y sus valores son diferentes, retornamos un objeto de error
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  // Si coinciden, retornamos null (sin errores)
  return null;
};

// Funciones individuales para evaluar cada regla
export function hasMinLength(password: string): boolean {
  return password.length >= 8;
}

export function hasNumber(password: string): boolean {
  return /\d/.test(password);
}

export function hasSpecialChar(password: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

