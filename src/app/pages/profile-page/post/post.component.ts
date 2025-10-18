import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { Post, PostComment } from '../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../../../data/services/profile.service';
import { CommentComponent } from './comment/comment.component';
import { DatePastTimePipe } from '../../../helpers/pipes/date-past-time.pipe';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIcon,
    PostInputComponent,
    CommentComponent,
    DatePastTimePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @ViewChild('commentInputContent') childComponent!: PostInputComponent;

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
      }),
    );
    this.childComponent.clearText();
    const newComments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id),
    );
    this.comments.set(newComments);
  }
}
