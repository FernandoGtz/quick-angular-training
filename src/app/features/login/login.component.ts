import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

/*
 * Login component.
 * Renders a reactive form to authenticate an existing user through the
 * AuthService and redirects to the dashboard on success. Shows a global
 * error message when the credentials are invalid.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  // Injection of the form builder, the auth service and the router
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm!: FormGroup;

  // Component state
  errorMessage: string | null = null;
  loading = false;

  /* Initializes the reactive form with its validators. */
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /*
   * Handles the login button.
   * Marks the form as touched if it is invalid; otherwise calls the auth
   * service, redirects to the dashboard and shows errors on failure.
   */
  async onSubmit() {
    // If the form is invalid
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);

      // Redirection
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'Credenciales inválidas';
    } finally {
      this.loading = false;
    }
  }
}
