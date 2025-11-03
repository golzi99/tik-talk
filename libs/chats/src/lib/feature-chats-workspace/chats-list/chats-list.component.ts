import { Component, inject } from '@angular/core';
import { ChatBtnComponent } from '../chat-btn/chat-btn.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chats-list',
  imports: [ChatBtnComponent, AsyncPipe, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl();

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap(chats => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        map(inputValue => {
          return chats.filter(chat => {
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          });
        })
      );
    })
  );
}
