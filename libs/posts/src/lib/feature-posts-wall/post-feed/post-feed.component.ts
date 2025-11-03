import { Component, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PostComponent } from '../index';
import { MessageInputComponent } from '@tt/common-ui';
import { PostService, Profile } from '@tt/data-access';

@Component({
  selector: 'app-post-feed',
  imports: [PostComponent, FormsModule, AsyncPipe, MessageInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  profile = input<Profile>();
  destroy$ = new Subject<void>();

  postService = inject(PostService);
  router = inject(ActivatedRoute);
  r2 = inject(Renderer2);
  feed = this.postService.posts;

  isMe$ = this.router.params.pipe(map(params => params['id'] === 'me'));

  hostElement = inject(ElementRef);

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  constructor() {
    effect(() => {
      const currentProfile = this.profile();
      const id = this.router.snapshot.params['id'];

      if (id) {
        const userId = id === 'me' ? currentProfile?.id : +id;
        firstValueFrom(this.postService.fetchPosts(userId));
      }
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreatePost(textAreaValue: string) {
    const content = textAreaValue;
    if (!content || content.trim() === '') {
      alert('Ошибка: Оба поля должны быть заполнены!');
      return;
    }

    firstValueFrom(
      this.postService.createPost({
        content,
        authorId: this.profile()?.id!,
      })
    );
  }
}
