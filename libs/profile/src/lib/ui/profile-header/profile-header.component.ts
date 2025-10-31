import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Profile } from '../../data';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  standalone: true,
})
export class ProfileHeader {
  profile = input<Profile>();
}
