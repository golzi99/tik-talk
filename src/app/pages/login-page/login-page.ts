import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../api/services/auth/auth-service';
import { AuthForm } from '../../api/services/auth/auth-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  standalone: true,
  styleUrl: './login-page.scss',
})
export class LoginPage {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup<AuthForm>({
    username: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (this.form.valid)
      this.authService.login(this.form.value).subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
