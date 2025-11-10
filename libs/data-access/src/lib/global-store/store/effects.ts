import { inject, Injectable } from '@angular/core';
import { ProfileService } from '../../profile-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { globalActions } from './actions';

@Injectable({
  providedIn: 'root',
})
export class GlobalEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  loadedMe = createEffect(() => {
    return this.actions$.pipe(
      ofType(globalActions.getMe),
      switchMap(() => {
        return this.profileService.getMe();
      }),
      map(res => globalActions.loadedMe({ profile: res }))
    );
  });
}
