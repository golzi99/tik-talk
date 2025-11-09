import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { PostFeedComponent } from '@tt/posts';
import { ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { ProfileHeader } from '../../ui';
import {
  GlobalStoreService,
  ProfileService,
} from '@tt/data-access/profile-api';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeader,
    AsyncPipe,
    SvgIcon,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  standalone: true,
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isMyPage = signal(false);

  globalStore = inject(GlobalStoreService);
  me$ = toObservable(this.globalStore.me);

  subscribers$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me')
        return this.profileService.getSubscribersList({ countSubs: 6 });
      return this.profileService.getSubscribersList({
        countSubs: 6,
        accountId: id,
      });
    })
  );

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.globalStore.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(profileId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { profileId } });
  }
}
