import { Component, input } from '@angular/core';
import { AvatarCircleComponent, DatePastTimePipe } from '@tt/common-ui';
import { LastMessageResponse } from '@tt/data-access/chats-api';

@Component({
  selector: 'app-chat-btn',
  imports: [AvatarCircleComponent, DatePastTimePipe],
  templateUrl: './chat-btn.component.html',
  styleUrl: './chat-btn.component.scss',
})
export class ChatBtnComponent {
  chat = input<LastMessageResponse>();
}
