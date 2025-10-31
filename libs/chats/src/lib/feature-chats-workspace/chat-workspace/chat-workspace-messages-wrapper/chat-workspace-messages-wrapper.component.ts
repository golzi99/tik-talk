import { Component, inject, input } from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { ChatsService } from '../../../data';
import { Chat } from '../../../data';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { MessageInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);
  chat = input.required<Chat>();

  groupedMessages = this.chatsService.groupedChatMessages;

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage({
        chatId: this.chat().id,
        message: messageText,
      })
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
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
