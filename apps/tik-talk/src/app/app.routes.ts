import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { chatsRoutes } from './pages/chats-page/chatsRoutes';
import { FormsExperimentalComponent } from './experimental/test-form/form-experimental/form-experimental.component';
import { accessGuard } from '@tt/auth';

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
