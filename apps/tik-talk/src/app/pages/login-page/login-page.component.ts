import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SvgIcon } from '../../../../../../libs/common-ui/src/lib/components/svg-icon/svg-icon.component';
import { AuthForm, AuthService } from '@tt/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, SvgIcon],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup<AuthForm>({
    username: new FormControl(null, {
      validators: [Validators.required],
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.valid)
      this.authService.login(this.form.value).subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
