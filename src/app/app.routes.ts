import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { SearchPage } from './pages/search-page/search-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { Layout } from './shared/components/layouts/layout/layout';
import { accessGuard } from './api/services/auth/access-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'search', component: SearchPage },
      { path: 'profile/:id', component: ProfilePage },
    ],
    canActivate: [accessGuard],
  },
  { path: 'login', component: LoginPage },
];
