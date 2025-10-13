import { Component, input } from '@angular/core';
import { Profile } from '../../../api/services/profile/profile.interface';
import { ImgUrlPipe } from '../../../utils/pipes/img-url-pipe';

@Component({
  selector: 'app-profile-card',
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.html',
  standalone: true,
  styleUrl: './profile-card.scss',
})
export class ProfileCard {
  profile = input.required<Profile>();
}
