import { Component, inject, input, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent } from '@tt/posts';
import { Post, PostComment, PostService } from '../../data';
import {
  AvatarCircleComponent,
  DatePastTimePipe,
  MessageInputComponent,
  SvgIcon,
} from '@tt/common-ui';
import { ProfileService } from '@tt/profile';

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
  post = input<Post>();
  postService = inject(PostService);
  me = inject(ProfileService).me;

  comments = signal<PostComment[]>([]);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onSendComment(textAreaValue: string) {
    const comment = textAreaValue;

    if (!comment || comment.trim() === '') {
      alert('Ошибка: Комментарий должен быть заполнен!');
      return;
    }

    await firstValueFrom(
      this.postService.createComment({
        postId: this.post()?.id!,
        authorId: this.me()?.id!,
        text: comment.trim(),
        commentId: 0,
      })
    );
    const newComments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(newComments);
  }
}
