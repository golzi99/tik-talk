import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  Renderer2,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIcon } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { selectMe } from '@tt/data-access/global-store';

@Component({
  selector: 'app-message-input',
  imports: [AvatarCircleComponent, ReactiveFormsModule, SvgIcon, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
  store = inject(Store);
  r2 = inject(Renderer2);
  me = this.store.selectSignal(selectMe);

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
