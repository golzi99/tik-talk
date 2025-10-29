import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

export interface Features {
  code?: string;
  label?: string;
  value?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MockService {
  constructor() {}

  getAddresses(): Observable<Address[]> {
    const addresses: Address[] = [
      {
        city: 'Москва',
        street: 'Тверская',
        building: 15,
        apartment: 25,
      },
      {
        city: 'Санкт-Петербург',
        street: 'Невский проспект',
        building: 42,
        apartment: 10,
      },
    ];

    return of(addresses);
  }

  getFeatures(): Observable<Features[]> {
    const features: Features[] = [
      {
        code: 'FEAT_001',
        label: 'Подъем на этаж',
        value: true,
      },
      {
        code: 'FEAT_002',
        label: 'Усиленная упаковка',
        value: false,
      },
      {
        code: 'FEAT_003',
        label: 'Ускоренная доставка',
        value: true,
      },
    ];

    return of(features);
  }
}
