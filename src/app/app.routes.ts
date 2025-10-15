import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page.component';
import { SearchPage } from './pages/search-page/search-page.component';
import { ProfilePage } from './pages/profile-page/profile-page.component';
import { Layout } from './common-ui/layout/layout.component';
import { accessGuard } from './auth/access-guard';

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
