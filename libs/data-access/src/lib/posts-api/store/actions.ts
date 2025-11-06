import { createActionGroup, props } from '@ngrx/store';
import { Post, PostComment } from '../../posts-api';
import { CommentCreateDto, PostCreateDto } from '../interfaces/post.interface';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'get posts': props<{ userId?: number }>(),
    'get post': props<{ postId: number }>(),
    'posts loaded': props<{ posts: Post[] }>(),
    'update comments post': props<{ postComments: PostComment[] }>(),
    'create post': props<PostCreateDto>(),
    'create comment': props<CommentCreateDto>(),
  },
});
