import { Profile } from '../../profile-api';

export interface GlobalState {
  me: Profile | null;
}
