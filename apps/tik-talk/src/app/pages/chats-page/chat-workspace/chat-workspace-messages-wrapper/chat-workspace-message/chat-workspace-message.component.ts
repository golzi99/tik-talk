import { Component, HostBinding, input } from '@angular/core';
import { Message } from '../../../../../data/interfaces/chats.interface';
import { AvatarCircleComponent } from '../../../../../../../../../libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { DateTimePipe } from '../../../../../../../../../libs/common-ui/src/lib/pipes/date-time.pipe';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [AvatarCircleComponent, DateTimePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
