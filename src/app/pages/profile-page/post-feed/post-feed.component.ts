import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../../data/services/post.service';
import {
  debounceTime,
  firstValueFrom,
  fromEvent,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent, FormsModule, AsyncPipe],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  profile = input<Profile>();
  destroy$ = new Subject<void>();

  @ViewChild('postInputContent') childComponent!: PostInputComponent;

  postService = inject(PostService);
  router = inject(ActivatedRoute);
  r2 = inject(Renderer2);
  feed = this.postService.posts;

  isMe$ = this.router.params.pipe(map((params) => params['id'] === 'me'));

  titleValue: string = '';

  hostElement = inject(ElementRef);

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
    /* тут делать проверку страницы
       Если не me, то нужно передать id в fetch и там прокинуть, чтобы по id
       сделать запрос за постами
    */
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  onCreatePost(textAreaValue: string) {
    const content = textAreaValue;
    const title = this.titleValue;

    if (!content || content.trim() === '' || !title || title.trim() === '') {
      alert('Ошибка: Оба поля должны быть заполнены!');
      return;
    }

    firstValueFrom(
      this.postService.createPost({
        title,
        content,
        authorId: this.profile()?.id!,
        communityId: 0,
      }),
    ).then(() => {
      this.titleValue = '';
      this.childComponent.clearText();
    });
  }
}
