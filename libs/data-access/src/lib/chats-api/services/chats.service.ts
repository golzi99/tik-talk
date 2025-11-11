import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Chat,
  GroupChatMessages,
  LastMessageResponse,
  Message,
} from '../interfaces/chats.interface';
import { map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { DateTime } from 'luxon';
import { AuthService } from '../../auth-api';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { Store } from '@ngrx/store';
import { selectMe } from '../../global-store';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  wsAdapter = new ChatWsRxjsService();

  http = inject(HttpClient);
  store = inject(Store);
  #authService = inject(AuthService);

  me = this.store.selectSignal(selectMe);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  chatApiUrl = `${this.baseApiUrl}chat/`;
  messageApiUrl = `${this.baseApiUrl}message/`;

  readonly refreshChats$ = new Subject<void>();

  groupedChatMessages = signal<GroupChatMessages[]>([]);
  unreadMessengerCounter = signal<number | null>(null);

  companion = computed(() => {
    const groupChatMessages = this.groupedChatMessages()[0];

    if (
      !groupChatMessages.messages ||
      groupChatMessages.messages.length === 0
    ) {
      return null;
    }

    const companionMessage = groupChatMessages.messages.find(
      (message: Message) => !message.isMine
    );

    return companionMessage?.user || null;
  });

  myChats$ = this.refreshChats$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.http.get<LastMessageResponse[]>(`${this.chatApiUrl}get_my_chats/`)
    )
  );

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage,
    }) as Observable<ChatWsMessage>;
  }

  disconnectWs() {
    this.wsAdapter.disconnect();
  }

  handleWSMessage = (message: ChatWsMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessengerCounter.set(message.data.count);
    }

    if (isNewMessage(message)) {
      const createdAt = DateTime.fromFormat(
        message.data.created_at,
        'yyyy-MM-dd HH:mm:ss',
        {
          zone: 'utc',
        }
      )
        .setZone('local')
        .setLocale('ru');

      // const existingGroup = this.groupedChatMessages().find(group =>
      //   group.dateTime.hasSame(createdAt, 'day')
      // );

      const patchedMessage: Message = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: createdAt.toString(),
        isRead: false,
        isMine: message.data.author === this.me()?.id,
        user:
          message.data.author === this.me()?.id ? this.me() : this.companion(),
      };

      // if (existingGroup) {
      //   existingGroup.messages.push(patchedMessage);
      // } else {
      //   this.groupedChatMessages().push({
      //     dateTime: createdAt,
      //     messages: [patchedMessage],
      //   });
      // }

      this.groupedChatMessages.update(groups => {
        const existingGroup = groups.find(g =>
          g.dateTime.hasSame(createdAt, 'day')
        );

        if (existingGroup) {
          const updatedGroups = groups.map(group =>
            group === existingGroup
              ? { ...group, messages: [...group.messages, patchedMessage] }
              : group
          );
          return [...updatedGroups];
        } else {
          return [
            ...groups,
            { dateTime: createdAt, messages: [patchedMessage] },
          ];
        }
      });

      this.refreshChats$.next();
    }
  };

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatApiUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatApiUrl}get_my_chats/`
    );
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatApiUrl}${chatId}`).pipe(
      map((chat: Chat) => {
        const groupedMessages = chat.messages.reduce(
          (acc: GroupChatMessages[], currentValue) => {
            const currentDate = DateTime.fromISO(currentValue.createdAt, {
              zone: 'utc',
            })
              .setZone('local')
              .setLocale('ru');
            const existingGroup = acc.find(group =>
              group.dateTime.hasSame(currentDate, 'day')
            );

            const patchedMessages = {
              ...currentValue,
              user:
                chat.userFirst.id === currentValue.userFromId
                  ? chat.userFirst
                  : chat.userSecond,
              isMine: currentValue.userFromId === this.me()?.id,
            };

            if (existingGroup) {
              existingGroup.messages.push(patchedMessages);
            } else {
              acc.push({
                dateTime: currentDate,
                messages: [patchedMessages],
              });
            }
            return acc;
          },
          [] as GroupChatMessages[]
        );

        const patchedMessages = chat.messages.map(message => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()?.id,
          };
        });
        this.groupedChatMessages.set(groupedMessages);
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
          groupedMessages: groupedMessages,
        };
      })
    );
  }

  sendMessage(payload: { chatId: number; message: string }) {
    const { chatId, message } = payload;
    return this.http.post<Message>(
      `${this.messageApiUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
