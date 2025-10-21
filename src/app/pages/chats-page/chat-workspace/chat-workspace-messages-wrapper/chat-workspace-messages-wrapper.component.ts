import { Component, inject, input } from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import { ChatsService } from '../../../../data/services/chats.service';
import { Chat } from '../../../../data/interfaces/chats.interface';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);
  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessage;

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage({
        chatId: this.chat().id,
        message: messageText,
      }),
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  formatDaySeparator(dateString: string): string {
    const locale = 'ru';
    const now = DateTime.now().setLocale(locale);
    const date = DateTime.fromISO(dateString).setLocale(locale);

    if (date.hasSame(now, 'day')) {
      return 'Сегодня';
    }

    if (date.hasSame(now.minus({ days: 1 }), 'day')) {
      return 'Вчера';
    }

    return date.toFormat('dd.LL.yyyy');
  }

  isNewDay(currentIndex: number): boolean {
    const locale = 'ru';
    if (currentIndex === 0) {
      return true;
    }

    const currentMessage = this.messages()[currentIndex];
    const previousMessage = this.messages()[currentIndex - 1];

    const currentDate = DateTime.fromISO(currentMessage.createdAt).setLocale(
      locale,
    );
    const previousDate = DateTime.fromISO(previousMessage.createdAt).setLocale(
      locale,
    );

    return currentDate.toISODate() !== previousDate.toISODate();
  }
}
