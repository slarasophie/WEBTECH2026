import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
    }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Einfache manuelle Pruefung statt eines eigenen Gruppen-Validators: vergleicht die beiden
  // Passwort-Felder direkt (wie im Skript-Beispiel per Methode statt Validator-Funktion).
  passwordsMismatch(): boolean {
    return this.form.controls.password.value !== this.form.controls.confirmPassword.value;
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.passwordsMismatch()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const values = this.form.getRawValue();

    try {
      await firstValueFrom(
        this.auth.register({ username: values.username, email: values.email, password: values.password })
      );
      this.loading.set(false);
      this.router.navigate(['/profil']);
    } catch (err: any) {
      this.loading.set(false);
      this.errorMessage.set(err?.error?.message || 'Registrierung fehlgeschlagen');
    }
  }
}
