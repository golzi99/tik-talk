import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { LastMessageResponse } from '../../../data/interfaces/chats.interface';
import { DatePastTimePipe } from '../../../helpers/pipes/date-past-time.pipe';

@Component({
  selector: 'app-chat-btn',
  imports: [AvatarCircleComponent, DatePastTimePipe],
  templateUrl: './chat-btn.component.html',
  styleUrl: './chat-btn.component.scss',
})
export class ChatBtnComponent {
  chat = input<LastMessageResponse>();
}
