import { Routes } from '@angular/router';
import { SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { accessGuard, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent } from '@tt/profile';
import { LayoutComponent } from '@tt/layout';
import { FormsExperimentalComponent } from '@tt/experimental-form';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  PostsEffects,
  postsFeature,
  ProfileEffects,
  profileFeature,
} from '@tt/data-access';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects),
        ],
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [provideState(postsFeature), provideEffects(PostsEffects)],
      },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'chats', loadChildren: () => chatsRoutes },
      { path: 'experimental', component: FormsExperimentalComponent },
    ],
    canActivate: [accessGuard],
  },
  { path: 'login', component: LoginPageComponent },
];
