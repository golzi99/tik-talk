import { Component, inject } from '@angular/core';
import { ProfileHeader } from '../../shared/components/profile-header/profile-header';
import { ProfileService } from '../../data/services/profile/profile-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { async, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from '../../shared/icon/svg-icon/svg-icon';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';

@Component({
  selector: 'app-profile-page',
  imports: [ProfileHeader, AsyncPipe, SvgIcon, RouterLink, ImgUrlPipe],
  templateUrl: './profile-page.html',
  standalone: true,
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  profileService = inject(ProfileService);
  router = inject(ActivatedRoute);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersList(6);

  profile$ = this.router.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    }),
  );
  protected readonly async = async;
}
