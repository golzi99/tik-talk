import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { debounceTime, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PostComponent } from '../index';
import { MessageInputComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { Profile } from '@tt/data-access/profile-api';
import { postsActions, selectPosts } from '@tt/data-access/posts-api';

@Component({
  selector: 'app-post-feed',
  imports: [PostComponent, FormsModule, AsyncPipe, MessageInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  profile = input<Profile>();
  destroy$ = new Subject<void>();

  store = inject(Store);
  router = inject(ActivatedRoute);

  news = this.store.selectSignal(selectPosts);

  isMe$ = this.router.params.pipe(map(params => params['id'] === 'me'));

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

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
        this.store.dispatch(postsActions.getPosts({ userId }));
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
      alert('Ошибка: Описание поста должно быть заполнено!');
      return;
    }

    this.store.dispatch(
      postsActions.createPost({ content, authorId: this.profile()?.id! })
    );
  }
}
