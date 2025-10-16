import { Component, inject } from '@angular/core';
import { ProfileService } from '../../data/services/profile/profile-service';
import { ProfileCard } from '../../common-ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles$ = this.profileService.filteredProfiles;

  constructor() {}
}
