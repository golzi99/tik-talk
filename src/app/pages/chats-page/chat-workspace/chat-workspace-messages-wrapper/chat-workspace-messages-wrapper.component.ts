import { Component, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import { ChatsService } from '../../../../data/services/chats.service';
import { Chat } from '../../../../data/interfaces/chats.interface';
import { debounceTime, firstValueFrom, fromEvent, Subject, takeUntil } from 'rxjs';
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
  //
  // isNewDay(currentIndex: number): boolean {
  //   const locale = 'ru';
  //   if (currentIndex === 0) {
  //     return true;
  //   }
  //
  //   const currentMessage = this.messages()[currentIndex];
  //   const previousMessage = this.messages()[currentIndex - 1];
  //
  //   const currentDate = DateTime.fromISO(currentMessage.createdAt, {
  //     zone: 'utc',
  //   })
  //     .setZone('local')
  //     .setLocale(locale);
  //   const previousDate = DateTime.fromISO(previousMessage.createdAt, {
  //     zone: 'utc',
  //   })
  //     .setZone('local')
  //     .setLocale(locale);
  //
  //   return currentDate.toISODate() !== previousDate.toISODate();
  // }

  // destroy$ = new Subject<void>();
  // r2 = inject(Renderer2);
  //
  // hostElement = inject(ElementRef);
  //
  // resizeFeed() {
  //   const { top } = this.hostElement.nativeElement.getBoundingClientRect();
  //
  //   const height = window.innerHeight - top - 24;
  //   this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  // }
  //
  // ngAfterViewInit() {
  //   this.resizeFeed();
  //
  //   fromEvent(window, 'resize')
  //     .pipe(debounceTime(500), takeUntil(this.destroy$))
  //     .subscribe(() => {
  //       this.resizeFeed();
  //     });
  // }
  //
  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
