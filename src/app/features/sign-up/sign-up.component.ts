import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { ToastService } from '../../core/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  public signUpForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: [passwordMatchValidator]
  });


  public errorMessage: string = '';
  private formValues = toSignal(this.signUpForm.valueChanges, {
    initialValue: this.signUpForm.value
  });

  // 2. Extraemos valores memoizados
  private password = computed(() => this.formValues()?.password || '');
  private confirmPassword = computed(() => this.formValues()?.confirmPassword || '');

  // 3. Reglas computadas: Solo se recalculan si 'password' cambia
  public isMinLengthValid = computed(() => this.password().length >= 8);
  public isNumberValid = computed(() => /\d/.test(this.password()));
  public isSpecialCharValid = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(this.password()));

  public doPasswordsMatch = computed(() => {
    const pass = this.password();
    const confirm = this.confirmPassword();
    return pass.length > 0 && pass === confirm;
  });

  // 4. Estado del botón: Se recalcula solo si alguna de las señales dependientes cambia
  public isFormReady = computed(() =>
    this.isMinLengthValid() &&
    this.isNumberValid() &&
    this.isSpecialCharValid() &&
    this.doPasswordsMatch() &&
    this.signUpForm.get('email')?.valid
  );

  ngOnInit() {
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


