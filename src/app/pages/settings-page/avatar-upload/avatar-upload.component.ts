import { Component, signal } from '@angular/core';
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon.component';
import { DndDirective } from '../../../common-ui/derectives/dnd.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIcon, DndDirective, FormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  avatar: File | null = null;

  preview = signal<string>('/assets/imgs/placeholder-avatar.svg');

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
}
