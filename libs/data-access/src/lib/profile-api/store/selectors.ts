import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';
import { Profile } from '../../profile-api';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles: Profile[]) => profiles
);

export const selectFiltersParams = createSelector(
  profileFeature.selectProfileFilters,
  filters => filters
);

export const selectProfilePageable = createSelector(
  profileFeature.selectProfileFeatureState,
  state => {
    return {
      page: state.page,
      size: state.size,
    };
  }
);
