import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  transform(value: Date | string | number, format: string = 'HH:mm'): string {
    if (!value) return '';

    let dateTime: DateTime;

    if (typeof value === 'string' || typeof value === 'number') {
      dateTime = DateTime.fromISO(value.toString(), { zone: 'utc' });
    } else {
      dateTime = DateTime.fromJSDate(value, { zone: 'utc' });
    }

    dateTime = dateTime.setZone(DateTime.local().zone);

    return dateTime.isValid ? dateTime.toFormat(format) : 'Invalid Date';
  }
}
