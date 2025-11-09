import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profile } from '@tt/data-access/profile-api';

@Injectable({
  providedIn: 'root',
})
export class NameValidator implements AsyncValidator {
  http = inject(HttpClient);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.http
      .get<Profile[]>('https://icherniakov.ru/yt-course/account/test_accounts')
      .pipe(
        delay(1000),
        map(profiles => {
          return profiles.filter(
            (profile: Profile) => profile.firstName === control.value
          ).length > 0
            ? null
            : {
                nameValid: {
                  message: `Имя должно быть одинм из спика: ${profiles.map(profile => profile.firstName).join(', ')}`,
                },
              };
        })
      );
  }
}
