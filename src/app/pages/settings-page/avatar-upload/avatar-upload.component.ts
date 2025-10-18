import { Component, inject, signal } from '@angular/core';
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon.component';
import { DndDirective } from '../../../common-ui/derectives/dnd.directive';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile.service';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIcon, DndDirective, FormsModule],
  providers: [ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService);
  imgPipe = inject(ImgUrlPipe);

  avatar: File | null = null;
  placeholder = '/assets/imgs/placeholder-avatar.svg';

  preview = signal<string>(this.placeholder);

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() || '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }

  constructor() {
    const me = this.profileService.me();
    if (me?.avatarUrl) {
      const url = this.imgPipe.transform(me.avatarUrl);
      this.preview.set(url || this.placeholder);
    } else {
      this.preview.set(this.placeholder);
    }
  }
}
