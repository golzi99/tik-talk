import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  imports: [],
  template: ` <svg
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 0 16 16"
    fill="none"
  >
    <use [attr.href]="href" />
  </svg>`,
  styles: [''],
  standalone: true,
})
export class SvgIcon {
  @Input() icon: string = '';
  @Input() size: number = 16;

  get href() {
    return `/assets/icons/${this.icon}.svg#${this.icon}`;
  }
}
