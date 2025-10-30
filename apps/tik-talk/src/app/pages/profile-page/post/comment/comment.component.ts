import { Component, input } from '@angular/core';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { DatePastTimePipe } from '../../../../helpers/pipes/date-past-time.pipe';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DatePastTimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
