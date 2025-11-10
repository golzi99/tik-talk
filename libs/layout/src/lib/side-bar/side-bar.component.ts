import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { SubscriberCard } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GlobalStoreService,
  ProfileService,
} from '@tt/data-access/profile-api';
import { AuthService } from '@tt/data-access/auth-api';
import { ChatsService, isErrorMessage } from '@tt/data-access/chats-api';

@Component({
  selector: 'app-side-bar',
  imports: [
    SubscriberCard,
    RouterLink,
    SvgIcon,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBar {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  #chatService = inject(ChatsService);
  destroyRef = inject(DestroyRef);

  subscribers$ = this.profileService.getSubscribersList({ countSubs: 3 });
  me = inject(GlobalStoreService).me;
  messageCounter = this.#chatService.unreadMessengerCounter;

  wsSubscription!: Subscription;

  menuItems = [
    { label: 'Моя страница', icon: 'home', link: '/profile/me' },
    { label: 'Чаты', icon: 'chat', link: '/chats' },
    { label: 'Поиск', icon: 'search', link: '/search' },
    { label: 'EXPERIMENTAL', icon: 'settings', link: '/experimental' },
  ];

  isSettingsOpen = false;

  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  connectWs() {
    this.wsSubscription?.unsubscribe();
    this.wsSubscription = this.#chatService
      .connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(message => {
        if (isErrorMessage(message)) {
          this.reconnect();
        }
      });
  }

  async reconnect() {
    await firstValueFrom(this.authService.refreshAuthToken());
    await firstValueFrom(timer(2000));
    this.connectWs();
  }

  async connect() {
    await firstValueFrom(this.profileService.getMe());
    this.#chatService
      .connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  constructor() {
    this.connect();

    // this.connectWs();
  }
}
