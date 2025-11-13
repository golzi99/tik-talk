import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`);
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersList(payload: { countSubs: number; accountId?: number }) {
    const { countSubs, accountId } = payload;

    return this.http
      .get<
        Pageble<Profile>
      >(`${this.baseApiUrl}account/subscribers/${accountId ? accountId : ''}`)
      .pipe(map(res => res.items.slice(0, countSubs)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post(`${this.baseApiUrl}account/upload_image`, fd);
  }

  filterProfiles(params: Record<string, any>) {
    return this.http.get<Pageble<Profile>>(
      `${this.baseApiUrl}account/accounts`,
      {
        params,
      }
    );
  }
}
