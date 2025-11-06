import { ProfileState } from '../../profile-api';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

export const initialStateProfile: ProfileState = {
  profiles: [],
  profileFilters: {},
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialStateProfile,
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles,
      };
    }),
    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters,
      };
    })
  ),
});
