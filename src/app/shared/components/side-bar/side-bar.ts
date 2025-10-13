import { Component, inject } from '@angular/core';
import { SvgIcon } from '../../icon/svg-icon/svg-icon';
import { SubscriberCard } from './subscriber-card/subscriber-card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../../data/services/profile/profile-service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url-pipe';
import { AuthService } from '../../../auth/auth-service';

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
  templateUrl: './side-bar.html',
  standalone: true,
  styleUrl: './side-bar.scss',
})
export class SideBar {
  profileService = inject(ProfileService);
  authService = inject(AuthService);

  subscribers$ = this.profileService.getSubscribersList(3);
  me = this.profileService.me;

  menuItems = [
    { label: 'Моя страница', icon: 'home', link: '/profile/me' },
    { label: 'Чаты', icon: 'chat', link: '/chats' },
    { label: 'Поиск', icon: 'search', link: '/search' },
  ];

  isSettingsOpen = false;

  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
