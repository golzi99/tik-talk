import { Component, inject, signal } from '@angular/core';
import { DndDirective, ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { FormsModule } from '@angular/forms';
import { GlobalStoreService } from '@tt/data-access/profile-api';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIcon, DndDirective, FormsModule],
  providers: [ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  me = inject(GlobalStoreService).me;
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

    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() || '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }

  constructor() {
    if (this.me()?.avatarUrl) {
      const url = this.imgPipe.transform(this.me()!.avatarUrl);
      this.preview.set(url || this.placeholder);
    } else {
      this.preview.set(this.placeholder);
    }
  }
}
