import { Component, Input } from '@angular/core';
import { Profile } from '../../../../api/services/profile/profile.interface';
import { ImgUrlPipe } from '../../../../utils/pipes/img-url-pipe';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.html',
  styleUrl: './subscriber-card.scss',
  standalone: true,
})
export class SubscriberCard {
  @Input() profile!: Profile;
}
