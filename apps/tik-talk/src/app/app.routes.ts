import { Routes } from '@angular/router';
import { LayoutComponent } from '@tt/common-ui';
import { SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { FormsExperimentalComponent } from './experimental/test-form/form-experimental/form-experimental.component';
import { accessGuard, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent } from '@tt/profile';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search', component: SearchPageComponent },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'chats', loadChildren: () => chatsRoutes },
      { path: 'experimental', component: FormsExperimentalComponent },
    ],
    canActivate: [accessGuard],
  },
  { path: 'login', component: LoginPageComponent },
];
