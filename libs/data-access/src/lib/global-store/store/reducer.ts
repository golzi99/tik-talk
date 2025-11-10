import { createFeature, createReducer, on } from '@ngrx/store';
import { GlobalState } from '../interfaces/store.interface';
import { globalActions } from './actions';

export const initialGlobalState: GlobalState = {
  me: null,
};

export const globalFeature = createFeature({
  name: 'globalFeature',
  reducer: createReducer(
    initialGlobalState,
    on(globalActions.loadedMe, (state, payload) => {
      return {
        ...state,
        me: payload.profile,
      };
    })
  ),
});
