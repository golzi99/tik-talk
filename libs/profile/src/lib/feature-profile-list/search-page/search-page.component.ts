import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileCard } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';
import { selectFilteredProfiles } from '@tt/data-access/profile-api';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  store = inject(Store);
  profiles$ = this.store.selectSignal(selectFilteredProfiles);

  constructor() {}
}
