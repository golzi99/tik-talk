import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileCard } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';
import {
  profileActions,
  selectFilteredProfiles,
} from '@tt/data-access/profile-api';
import { WaIntersectionObserver } from '@ng-web-apis/intersection-observer';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCard, ProfileFiltersComponent, WaIntersectionObserver],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  store = inject(Store);
  profiles$ = this.store.selectSignal(selectFilteredProfiles);

  constructor() {}

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}));
  }

  onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return;

    if (entries[0].intersectionRatio > 0) {
      this.timeToFetch();
    }
  }
}
