import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'datePastTimePipe',
})
export class DatePastTimePipe implements PipeTransform {
  transform(value: string): string {
    const locale = 'ru';
    const now = DateTime.now().setLocale(locale);
    const createdAt = DateTime.fromISO(value, { zone: 'utc' })
      .setZone('local')
      .setLocale(locale);

    const diffInMilliseconds = now.diff(createdAt).as('milliseconds');

    if (diffInMilliseconds < 7 * 24 * 60 * 60 * 1000) {
      return createdAt.toRelative({ base: now, locale }) || 'Только что';
    }

    return createdAt.toFormat('dd.LL.yyyy');
  }
}
