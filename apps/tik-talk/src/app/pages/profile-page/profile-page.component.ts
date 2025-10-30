import { Component, inject, signal } from '@angular/core';
import { ProfileHeader } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from '../../common-ui/svg-icon/svg-icon.component';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { ChatsService } from '../../data/services/chats.service';
import { PostFeedComponent } from '@tt/posts';

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeader, AsyncPipe, SvgIcon, RouterLink, ImgUrlPipe, PostFeedComponent],
  templateUrl: './profile-page.component.html',
  standalone: true,
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isMyPage = signal(false);

  me$ = toObservable(this.profileService.me);

  subscribers$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') return this.profileService.getSubscribersList({ countSubs: 6 });
      return this.profileService.getSubscribersList({
        countSubs: 6,
        accountId: id,
      });
    })
  );

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(profileId: number) {
    const res = await firstValueFrom(this.chatsService.createChat(profileId));
    await this.router.navigate(['/chats', res.id]);
  }
}
