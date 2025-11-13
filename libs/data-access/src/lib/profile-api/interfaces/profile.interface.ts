export interface Profile {
  id: number;
  username: string;
  avatarUrl: string;
  subscribersAmount: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  stack: string[];
  city: string;
  description: string;
}

export interface ProfilesState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  page: number;
  size: number;
}
