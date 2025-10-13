import { Component, inject } from '@angular/core';
import { ProfileService } from '../../api/services/profile/profile-service';
import { Profile } from '../../api/services/profile/profile.interface';
import { ProfileCard } from '../../shared/components/profile-card/profile-card';

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
