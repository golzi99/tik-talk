import { Component, inject, Renderer2, signal } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { ProfileService } from '../../../data/services/profile.service';
import { SvgIcon } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostService } from '../../../data/services/post.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, SvgIcon, ReactiveFormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  postService = inject(PostService);
  text = signal<string>('');

  profile = inject(ProfileService).me;

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.text.set(textarea.value);

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (this.postForm.invalid) return;

    firstValueFrom(
      this.postService.createPost({
        title: this.postForm.value.title!,
        content: this.postForm.value.content!,
        authorId: this.profile()!.id,
        communityId: 0,
      }),
    );

    this.postForm.reset();
    this.text.set('');
  }
}
