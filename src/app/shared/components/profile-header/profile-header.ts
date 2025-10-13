import { Component, input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url-pipe';

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
