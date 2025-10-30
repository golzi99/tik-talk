import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Chat,
  GroupChatMessages,
  LastMessageResponse,
  Message,
} from '../interfaces/chats.interface';
import { ProfileService } from './profile.service';
import { map } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  chatApiUrl = `${this.baseApiUrl}chat/`;
  messageApiUrl = `${this.baseApiUrl}message/`;

  activeChatMessage = signal<Message[]>([]);
  groupedChatMessages = signal<GroupChatMessages[]>([]);

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatApiUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(`${this.chatApiUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatApiUrl}${chatId}`).pipe(
      map((chat: Chat) => {
        const groupedMessages = chat.messages.reduce((acc: GroupChatMessages[], currentValue) => {
          const currentDate = DateTime.fromISO(currentValue.createdAt, {
            zone: 'utc',
          })
            .setZone('local')
            .setLocale('ru');
          const existingGroup = acc.find(group => group.dateTime.hasSame(currentDate, 'day'));

          const patchedMessages = {
            ...currentValue,
            user: chat.userFirst.id === currentValue.userFromId ? chat.userFirst : chat.userSecond,
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
        }, [] as GroupChatMessages[]);

        const patchedMessages = chat.messages.map(message => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()?.id,
          };
        });
        this.groupedChatMessages.set(groupedMessages);
        this.activeChatMessage.set(patchedMessages);
        return {
          ...chat,
          companion: chat.userFirst.id === this.me()?.id ? chat.userSecond : chat.userFirst,
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
