import { Component, effect, inject, OnDestroy } from '@angular/core';
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
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    stack: new FormControl(''),
  });

  searchFormSub: Subscription;

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(formValue => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });

    this.searchForm.patchValue({
      ...this.filtersParams$(),
    });
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
