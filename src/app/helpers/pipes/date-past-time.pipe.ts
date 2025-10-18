import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePastTimePipe',
})
export class DatePastTimePipe implements PipeTransform {
  now = new Date();
  offset = this.now.getTimezoneOffset();

  transform(value: string): string {
    const createdAt = new Date(value);

    const diffInMilliseconds: number =
      this.now.getTime() - (createdAt.getTime() - this.offset * 60 * 1000);

    const day = createdAt.getDate().toString().padStart(2, '0');
    const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
    const year = createdAt.getFullYear();

    const result = `${day}.${month}.${year}`;

    if (diffInMilliseconds / 1000 < 60) return `Right now`;
    if (diffInMilliseconds / (1000 * 60) < 60)
      return `${Math.floor(diffInMilliseconds / (1000 * 60))} minutes ago`;
    if (diffInMilliseconds / (1000 * 60 * 60) < 24)
      return `${Math.floor(diffInMilliseconds / (1000 * 60 * 60))} hours ago`;
    if (diffInMilliseconds / (1000 * 60 * 60 * 24) < 7)
      return `${Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))} days ago`;
    else return result;
  }
}
