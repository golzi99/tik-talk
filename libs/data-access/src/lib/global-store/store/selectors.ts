import { createSelector } from '@ngrx/store';
import { globalFeature } from './reducer';

export const selectMe = createSelector(globalFeature.selectMe, me => me);
