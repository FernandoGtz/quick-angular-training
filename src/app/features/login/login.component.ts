import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  // Inyeccion de servicio, formulario y enrutador
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm!: FormGroup;

  // Variables
  errorMessage: string | null = null;
  loading = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Metodo para el boton iniciar sesion
  async onSubmit() {
    // Si el formulario no es
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);

      // Redirección
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Error de login:', error);
      this.errorMessage = 'Credenciales inválidas';
    } finally {
      this.loading = false;
    }
  }
}
