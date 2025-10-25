import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from './chats-list/chats-list.component';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chats-page',
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export class ChatsPageComponent {
  // destroy$ = new Subject<void>();
  // r2 = inject(Renderer2);
  //
  // hostElement = inject(ElementRef);
  //
  // resizeFeed() {
  //   const { top } = this.hostElement.nativeElement.getBoundingClientRect();
  //
  //   const height = window.innerHeight - top - 24;
  //   this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  // }
  //
  // ngAfterViewInit() {
  //   this.resizeFeed();
  //
  //   fromEvent(window, 'resize')
  //     .pipe(debounceTime(500), takeUntil(this.destroy$))
  //     .subscribe(() => {
  //       this.resizeFeed();
  //     });
  // }
  //
  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
