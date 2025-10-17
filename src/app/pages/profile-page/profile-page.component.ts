import { Component, inject } from '@angular/core';
import { ProfileHeader } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { async, map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from '../../common-ui/svg-icon/svg-icon.component';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';

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
  router = inject(ActivatedRoute);

  isMe$ = this.router.params.pipe(map((params) => params['id'] === 'me'));

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersList(6);

  profile$ = this.router.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    }),
  );
}
