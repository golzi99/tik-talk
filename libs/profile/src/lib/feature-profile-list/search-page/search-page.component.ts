import { Component, inject } from '@angular/core';
import { ProfileCard } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileService } from '../../data';

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
