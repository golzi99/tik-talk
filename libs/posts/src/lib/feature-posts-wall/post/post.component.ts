import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommentComponent } from '../../ui';
import {
  AvatarCircleComponent,
  DatePastTimePipe,
  MessageInputComponent,
  SvgIcon,
} from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { Post, postsActions } from '@tt/data-access/posts-api';
import { selectMe } from '@tt/data-access/global-store';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  store = inject(Store);

  post = input<Post>();
  me = this.store.selectSignal(selectMe);

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
