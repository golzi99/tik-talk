import { Component, input } from '@angular/core';
import { AvatarCircleComponent, DatePastTimePipe } from '@tt/common-ui';
import { PostComment } from '@tt/data-access/posts-api';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DatePastTimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
