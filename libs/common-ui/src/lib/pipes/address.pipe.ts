import { Pipe, PipeTransform } from '@angular/core';
import { AddressSuggestion } from '@tt/data-access/dadata-api';

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  transform(value: AddressSuggestion): string {
    const city = value.data.city
      ? `${value.data.city_type}.${value.data.city}`
      : '';
    const street = value.data.street
      ? `${value.data.street_type}.${value.data.street}`
      : '';
    const house = value.data.house
      ? `${value.data.house_type}.${value.data.house}`
      : '';
    const flat = value.data.flat
      ? `${value.data.flat_type}${value.data.flat}`
      : '';

    return `${city} ${street} ${house} ${flat}`.trim();
  }
}
