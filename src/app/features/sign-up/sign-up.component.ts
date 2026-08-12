import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { ToastService } from '../../core/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';

/*
 * Sign-up component.
 * Renders a reactive form to create a new Firebase Auth user. It uses
 * computed signals to validate password rules in real time, sends an
 * email verification and redirects to the login page on success.
 */
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

  // 1. Extract memoized field values from the form
  private password = computed(() => this.formValues()?.password || '');
  private confirmPassword = computed(() => this.formValues()?.confirmPassword || '');

  // 2. Computed rules: only recalculated when the password changes
  public isMinLengthValid = computed(() => this.password().length >= 8);
  public isNumberValid = computed(() => /\d/.test(this.password()));
  public isSpecialCharValid = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(this.password()));

  public doPasswordsMatch = computed(() => {
    const pass = this.password();
    const confirm = this.confirmPassword();
    return pass.length > 0 && pass === confirm;
  });

  // 3. Button state: recalculated only when any dependent signal changes
  public isFormReady = computed(() =>
    this.isMinLengthValid() &&
    this.isNumberValid() &&
    this.isSpecialCharValid() &&
    this.doPasswordsMatch() &&
    this.signUpForm.get('email')?.valid
  );

  ngOnInit() {
  }

  /*
   * Handles the sign-up form submission.
   * Creates the user in Firebase Auth, sends a verification email and
   * redirects to the login page. Maps common Firebase errors to a
   * user-friendly message.
   */
  async onSubmit() {
    if (this.signUpForm.valid) {
      try {
        const { email, password } = this.signUpForm.value;

        const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);

        // If the user was created, send a confirmation email
        if (userCredentials.user) {
          await sendEmailVerification(userCredentials.user);
        }

        // Redirect to login after registering and confirm the operation to the user
        this.toastService.showToast('Cuenta creada con éxito. Revisa tu correo para verificar.');
        await this.router.navigate(['/login']);
        console.log('User created. Verification email sent.');
      } catch (error: any) {
        // Handle common Firebase errors (e.g. 'auth/email-already-in-use')
        console.error('Sign-up error:', error);
        // Handle common Firebase Auth error codes
        if (error.code === 'auth/email-already-in-use') this.errorMessage = 'Este correo electrónico ya se encuentra registrado.';
        else if (error.code === 'auth/weak-password') this.errorMessage = 'La contraseña es demasiado débil.';
        else this.errorMessage = 'Ocurrió un error al intentar crear la cuenta.';
      }
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}

/*
 * Validator function that receives the whole form group.
 * Returns a passwordMismatch error when both password fields exist and
 * their values differ, or null when they match.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // If both fields exist and their values differ, return an error object
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  // If they match, return null (no errors)
  return null;
};


