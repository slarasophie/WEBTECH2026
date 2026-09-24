import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

const CONTACT_EMAIL = 'Lara.Suter@student.htw-berlin.de';

@Component({
  selector: 'app-kontakt',
  imports: [ReactiveFormsModule],
  templateUrl: './kontakt.html',
  styleUrl: './kontakt.css'
})
export class Kontakt {
  readonly contactEmail = CONTACT_EMAIL;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] })
  });

  // Öffnet den lokalen Mail-Client mit vorausgefüllter Nachricht (kein Backend-Versand)
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const subject = encodeURIComponent(`FitTrack Kontaktanfrage von ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }
}
