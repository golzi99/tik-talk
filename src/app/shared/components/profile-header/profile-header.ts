import { Component, input } from '@angular/core';
import { Profile } from '../../../api/services/profile/profile.interface';
import { ImgUrlPipe } from '../../../utils/pipes/img-url-pipe';

@Component({
  selector: 'app-profile-header',
  imports: [ImgUrlPipe],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss',
  standalone: true,
})
export class ProfileHeader {
  profile = input<Profile>();
}
