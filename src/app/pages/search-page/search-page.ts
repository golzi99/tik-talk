import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile/profile-service';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileCard } from '../../common-ui/profile-card/profile-card';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard],
  templateUrl: './search-page.html',
  standalone: true,
  styleUrl: './search-page.scss',
})
export class SearchPage {
  profileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService.getTestAccounts().subscribe((val) => {
      this.profiles = val;
    });
  }
}
