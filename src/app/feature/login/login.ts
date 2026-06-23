import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  // private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      // mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // this.auth.login();

      await this.router.navigate(['/dashboard']);
    } finally {
      this.loading.set(false);
    }
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}