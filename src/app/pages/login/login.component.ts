import { Component, inject, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule//para html

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  msg = signal('');

  form = this.fb.group<{
    ci: FormControl<string>,
    password: FormControl<string>,
  }>({
    ci: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    password: this.fb.control('', Validators.required),
  });

  protected onEntrar() {
    const data = this.form.getRawValue();
    this.authService.login(data).subscribe({
      next: (response: any) => {
        if (response.access_token) {
          this.authService.setToken(response.access_token);
          this.router.navigate(['/dashboard']);
        } else {
          this.msg.set('Error en la autenticación');
        }
      },
      error: err => {
        console.log(err);
        this.msg.set(err.error.message || 'Error al intentar iniciar sesión');
      }
    });
  }

}
