import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { Profile } from '../../data';

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe, SvgIcon, RouterLink],
  templateUrl: './profile-card.component.html',
  standalone: true,
  styleUrl: './profile-card.component.scss',
})
export class ProfileCard {
  profile = input.required<Profile>();
}
