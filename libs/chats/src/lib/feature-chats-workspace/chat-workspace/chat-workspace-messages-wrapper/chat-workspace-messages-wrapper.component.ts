import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { DateTime } from 'luxon';
import { MessageInputComponent } from '@tt/common-ui';
import { Chat, ChatsService } from '@tt/data-access/chats-api';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);
  chat = input.required<Chat>();

  groupedMessages = this.chatsService.groupedChatMessages;

  async onSendMessage(messageText: string) {
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);
  }

  formatDaySeparator(date: DateTime): string {
    const locale = 'ru';
    const now = DateTime.now().setLocale(locale);
    const localeDate = date.setZone('local').setLocale(locale);

    if (localeDate.hasSame(now, 'day')) {
      return 'Сегодня';
    }

    if (localeDate.hasSame(now.minus({ days: 1 }), 'day')) {
      return 'Вчера';
    }

    return localeDate.toFormat('dd.LL.yyyy');
  }
}
