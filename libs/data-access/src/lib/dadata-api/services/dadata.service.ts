import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DADATA_TOKEN } from './token';
import { map } from 'rxjs';
import { AddressSuggestionsResponse } from '../interfaces/dadata.interface';

@Injectable({
  providedIn: 'root',
})
export class DadataService {
  #apiUrl =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address ';

  #http = inject(HttpClient);

  getSuggestion(query: string) {
    return this.#http
      .post<AddressSuggestionsResponse>(
        this.#apiUrl,
        { query },
        {
          headers: {
            Authorization: `Token ${DADATA_TOKEN}`,
          },
        }
      )
      .pipe(
        map(value => {
          return value.suggestions;
        })
      );
  }
}
