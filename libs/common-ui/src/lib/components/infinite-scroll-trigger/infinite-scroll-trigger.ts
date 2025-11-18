import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
} from '@angular/core';

@Component({
  selector: 'tt-infinite-scroll-trigger',
  imports: [],
  templateUrl: './infinite-scroll-trigger.html',
  styleUrl: './infinite-scroll-trigger.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollTrigger implements OnInit {
  loaded = output<void>();

  ngOnInit() {
    this.loaded.emit();
  }
}
