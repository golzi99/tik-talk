import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs';
import { profileActions, selectFiltersParams } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  store = inject(Store);
  filtersParams$ = this.store.selectSignal(selectFiltersParams);

  searchForm = new FormGroup({
    firstName: new FormControl(this.filtersParams$()['firstName'] ?? ''),
    lastName: new FormControl(this.filtersParams$()['lastName'] ?? ''),
    stack: new FormControl(this.filtersParams$()['stack'] ?? ''),
  });

  searchFormSub: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(startWith(this.filtersParams$()), debounceTime(300))
      .subscribe(formValue => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
