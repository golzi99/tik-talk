import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  imports: [],
  template: ` <svg
    [attr.width]="size"
    [attr.height]="size"
    [attr.viewBox]="viewBoxBase"
  >
    <use [attr.href]="href" />
  </svg>`,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  standalone: true,
})
export class SvgIcon {
  @Input() icon: string = '';
  @Input() size: number = 16;
  @Input() viewBoxBase: string = '0 0 16 16';

  get href() {
    return `/assets/icons/${this.icon}.svg#${this.icon}`;
  }
}
