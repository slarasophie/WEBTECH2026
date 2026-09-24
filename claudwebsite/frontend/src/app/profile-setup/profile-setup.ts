import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { ToastService } from '../shared/toast.service';
import { FitnessGoal } from '../shared/user';

@Component({
  selector: 'app-profile-setup',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-setup.html',
  styleUrl: './profile-setup.css'
})
export class ProfileSetup {
  protected readonly goals: FitnessGoal[] = ['Muskelaufbau', 'Abnehmen', 'Ausdauer', 'Allgemeine Fitness'];
  protected alreadyCompleted = false;

  // Profilbild (optional): wird lokal verkleinert und als Base64-Data-URI gespeichert
  readonly avatarPreview = signal<string | null>(null);
  readonly avatarSaving = signal(false);
  readonly avatarError = signal<string | null>(null);

  readonly form;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.alreadyCompleted = this.auth.currentUser()?.profileCompleted ?? false;
    this.avatarPreview.set(this.auth.currentUser()?.avatar || null);

    this.form = new FormGroup({
      age: new FormControl<number | null>(this.auth.currentUser()?.profile?.age ?? null, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(10), Validators.max(120)]
      }),
      weightKg: new FormControl<number | null>(this.auth.currentUser()?.profile?.weightKg ?? null, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(20), Validators.max(400)]
      }),
      heightCm: new FormControl<number | null>(this.auth.currentUser()?.profile?.heightCm ?? null, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(100), Validators.max(250)]
      }),
      goal: new FormControl<FitnessGoal | ''>(this.auth.currentUser()?.profile?.goal ?? '', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.avatarError.set('Bitte eine Bilddatei auswählen');
      input.value = '';
      return;
    }

    this.avatarError.set(null);

    try {
      const resized = await this.resizeImage(file, 320);
      this.avatarPreview.set(resized);
      this.saveAvatar(resized);
    } catch {
      this.avatarError.set('Bild konnte nicht verarbeitet werden');
    } finally {
      input.value = '';
    }
  }

  removeAvatar(): void {
    this.avatarPreview.set(null);
    this.saveAvatar('');
  }

  private async saveAvatar(avatar: string): Promise<void> {
    this.avatarSaving.set(true);
    try {
      await firstValueFrom(this.auth.updateAvatar(avatar));
      this.avatarSaving.set(false);
      this.toast.success(avatar ? 'Profilbild gespeichert' : 'Profilbild entfernt');
    } catch (err: any) {
      this.avatarSaving.set(false);
      this.toast.error('Profilbild konnte nicht gespeichert werden');
    }
  }

  // Skaliert das Bild im Browser auf max. maxSize px (quadratisch zugeschnitten)
  // und komprimiert es als JPEG, damit der Base64-Payload klein bleibt.
  private resizeImage(file: File, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
        img.onload = () => {
          const side = Math.min(img.width, img.height);
          const sx = (img.width - side) / 2;
          const sy = (img.height - side) / 2;
          const size = Math.min(maxSize, side);

          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas nicht verfügbar'));
            return;
          }
          ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();

    try {
      await firstValueFrom(
        this.auth.updateProfile({
          age: raw.age as number,
          weightKg: raw.weightKg as number,
          heightCm: raw.heightCm as number,
          goal: raw.goal as FitnessGoal
        })
      );
      this.saving.set(false);
      this.toast.success('Profil gespeichert');
      this.router.navigate(['/exercises']);
    } catch (err: any) {
      this.saving.set(false);
      this.errorMessage.set(err?.error?.message || 'Profil konnte nicht gespeichert werden');
    }
  }
}
