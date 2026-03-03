import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  isLogin = true;
  selectedRole: 'user' | 'admin' = 'user';

  LoginForm: FormGroup;
  RegisterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.RegisterForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      adminKey: [''],
    });
  }

  onIsRigester(): void {
    this.isLogin = !this.isLogin;
  }

  onLoginSubmit(): void {
    if (this.LoginForm.invalid) return;

    const { email, password } = this.LoginForm.value;

    this.authService.login(email, password, this.selectedRole).subscribe({
      next: () => {
        const target = this.selectedRole === 'admin' ? '/admin/dashboard' : '/dashboard';
        this.router.navigate([target]);
      },
      error: (err: any) => {
        console.error('Login failed', err);
      },
    });
  }

  onRigesterSubmit(): void {
    if (this.RegisterForm.invalid) return;

    if (this.selectedRole === 'admin' && !this.RegisterForm.value.adminKey) {
      this.RegisterForm.get('adminKey')?.setErrors({ required: true });
      return;
    }

    const payload = {
      ...this.RegisterForm.value,
      role: this.selectedRole,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLogin = true;
      },
      error: (err: any) => {
        console.error('Registration failed', err);
      },
    });
  }
}
