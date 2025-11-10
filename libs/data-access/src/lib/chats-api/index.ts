import {
  Chat,
  Message,
  LastMessageResponse,
} from './interfaces/chats.interface';
import { ChatsService } from './services/chats.service';
import { isErrorMessage } from './interfaces/type-guards';

export { ChatsService, isErrorMessage };
export type { Chat, Message, LastMessageResponse };
