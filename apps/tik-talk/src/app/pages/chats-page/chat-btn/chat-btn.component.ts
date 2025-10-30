import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../../../../libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { LastMessageResponse } from '../../../data/interfaces/chats.interface';
import { DatePastTimePipe } from '../../../../../../../libs/common-ui/src/lib/pipes/date-past-time.pipe';

@Component({
  selector: 'app-chat-btn',
  imports: [AvatarCircleComponent, DatePastTimePipe],
  templateUrl: './chat-btn.component.html',
  styleUrl: './chat-btn.component.scss',
})
export class ChatBtnComponent {
  chat = input<LastMessageResponse>();
}
