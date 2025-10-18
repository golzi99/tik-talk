import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePastTimePipe',
})
export class DatePastTimePipe implements PipeTransform {
  now = new Date();

  transform(value: string): string {
    const createdAt = new Date(value);
    const diffInMilliseconds: number = this.now.getTime() - createdAt.getTime();

    const day = createdAt.getDate();
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();

    const formattedMonth = month + 1;

    const result = `${day}.${formattedMonth}.${year}`;

    if (diffInMilliseconds / 1000 < 60) return `Right now`;
    if (diffInMilliseconds / (1000 * 60) < 60)
      return `${Math.floor(diffInMilliseconds / (1000 * 60))} minutes ago`;
    if (diffInMilliseconds / (1000 * 60 * 60) < 60)
      return `${Math.floor(diffInMilliseconds / (1000 * 60 * 60))} hours ago`;
    if (diffInMilliseconds / (1000 * 60 * 60 * 24) < 7)
      return `${Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))} days ago`;
    else return result;
  }
}
