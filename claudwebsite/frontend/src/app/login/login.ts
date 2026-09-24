import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.auth.login(this.form.getRawValue()));
      this.loading.set(false);
      this.router.navigate(['/exercises']);
    } catch (err: any) {
      this.loading.set(false);
      this.errorMessage.set(err?.error?.message || 'Login fehlgeschlagen');
    }
  }
}
