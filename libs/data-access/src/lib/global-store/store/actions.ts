import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../../profile-api';

export const globalActions = createActionGroup({
  source: 'global',
  events: {
    'get me': emptyProps(),
    'loaded me': props<{ profile: Profile }>(),
  },
});
