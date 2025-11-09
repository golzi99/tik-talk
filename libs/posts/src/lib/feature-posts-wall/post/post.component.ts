import { Component, inject, input } from '@angular/core';
import { CommentComponent } from '../../ui';
import {
  AvatarCircleComponent,
  DatePastTimePipe,
  MessageInputComponent,
  SvgIcon,
} from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { GlobalStoreService } from '@tt/data-access/profile-api';
import { Post, postsActions } from '@tt/data-access/posts-api';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIcon,
    CommentComponent,
    DatePastTimePipe,
    MessageInputComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  store = inject(Store);

  post = input<Post>();
  me = inject(GlobalStoreService).me;

  get comments() {
    return this.post()!.comments;
  }

  async onSendComment(textAreaValue: string) {
    const comment = textAreaValue;

    if (!comment || comment.trim() === '') {
      alert('Ошибка: Комментарий должен быть заполнен!');
      return;
    }

    this.store.dispatch(
      postsActions.createComment({
        postId: this.post()?.id!,
        authorId: this.me()?.id!,
        text: comment.trim(),
        commentId: 0,
      })
    );
  }
}
