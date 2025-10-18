import { Component, inject, input, output, Renderer2 } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Profile } from '../../../data/interfaces/profile.interface';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, SvgIcon, ReactiveFormsModule, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  textAreaValue: string = '';

  clearText(): void {
    this.textAreaValue = '';
  }

  r2 = inject(Renderer2);
  profile = input<Profile>();
  onSend = input<() => void>();

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSendClick() {
    const callback = this.onSend();
    if (callback) {
      callback();
    }
  }
}
