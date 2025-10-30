import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../../../../../../libs/common-ui/src/lib/pipes/img-url.pipe';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
  standalone: true,
})
export class SubscriberCard {
  @Input() profile!: Profile;
}
