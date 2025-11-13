import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { AvatarUploadComponent, ProfileHeader } from '../../ui';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '@tt/data-access/profile-api';
import { Store } from '@ngrx/store';
import { globalActions, selectMe } from '@tt/data-access/global-store';

@Component({
  selector: 'app-settings-page',
  imports: [ProfileHeader, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  profileService = inject(ProfileService);
  store = inject(Store);

  me = this.store.selectSignal(selectMe);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    username: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    description: new FormControl(''),
    stack: new FormControl(''),
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        ...this.me(),
        stack: this.mergeStack(this.me()?.stack),
      });
    });
  }

  async onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      await firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }
    await firstValueFrom(
      //@ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    );

    this.store.dispatch(globalActions.getMe());
  }

  splitStack(stack: string | null | string[] | undefined) {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
