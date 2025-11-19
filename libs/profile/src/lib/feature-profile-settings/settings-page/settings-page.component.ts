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
import { AddressInputComponent, StackInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeader,
    ReactiveFormsModule,
    AvatarUploadComponent,
    StackInputComponent,
    AddressInputComponent,
  ],
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
    stack: new FormControl<string[]>([]),
    city: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.me(),
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
      })
    );

    this.store.dispatch(globalActions.getMe());
  }
}
