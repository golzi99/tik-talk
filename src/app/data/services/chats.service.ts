import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Chat,
  LastMessageResponse,
  Message,
} from '../interfaces/chats.interface';
import { ProfileService } from './profile.service';
import { map } from 'rxjs';

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

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatApiUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatApiUrl}get_my_chats/`,
    );
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatApiUrl}${chatId}`).pipe(
      map((chat: Chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()?.id,
          };
        });
        this.activeChatMessage.set(patchedMessages);
        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      }),
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
      },
    );
  }
}
