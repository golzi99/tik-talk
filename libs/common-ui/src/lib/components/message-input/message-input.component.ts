import { Component, inject, output, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '@tt/profile';
import { SvgIcon } from '../svg-icon/svg-icon.component';
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';

@Component({
  selector: 'app-message-input',
  imports: [AvatarCircleComponent, ReactiveFormsModule, SvgIcon, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;

  textAreaValue: string = '';
  created = output<string>();

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onClick() {
    if (!this.textAreaValue) return;

    this.created.emit(this.textAreaValue);
    this.textAreaValue = '';
  }
}
