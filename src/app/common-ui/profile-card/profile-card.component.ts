import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { SvgIcon } from '../svg-icon/svg-icon.component';
import { RouterLink } from '@angular/router';

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
