import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../../../data/services/profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent, FormsModule],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  @ViewChild('postInputContent') childComponent!: PostInputComponent;

  postService = inject(PostService);
  feed = this.postService.posts;
  profile = inject(ProfileService).me();

  titleValue: string = '';

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  onSend() {
    const content = this.childComponent.textAreaValue;
    const title = this.titleValue;

    if (!content || content.trim() === '' || !title || title.trim() === '') {
      alert('Ошибка: Оба поля должны быть заполнены!');
      return;
    }

    firstValueFrom(
      this.postService.createPost({
        title,
        content,
        authorId: this.profile?.id!,
        communityId: 0,
      }),
    ).then(() => {
      this.titleValue = '';
      this.childComponent.clearText();
    });
  }
}
