import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostFeedComponent } from '@tt/posts';
import { ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { ProfileHeader } from '../../ui';
import { ProfileService } from '@tt/data-access/profile-api';
import { Store } from '@ngrx/store';
import { selectMe } from '@tt/data-access/global-store';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(Store);

  me$ = this.store.select(selectMe);
  meSignal = this.store.selectSignal(selectMe);

  isMyPage = signal(false);

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
      this.isMyPage.set(id === 'me' || id === this.meSignal()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(profileId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { profileId } });
  }
}
