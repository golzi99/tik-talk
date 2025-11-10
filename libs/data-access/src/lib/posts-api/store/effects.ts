import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { PostService } from '../../posts-api';
import { postsActions } from './actions';

@Injectable({
  providedIn: 'root',
})
export class PostsEffects {
  postsService = inject(PostService);
  actions$ = inject(Actions);

  loadPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.getPosts),
      switchMap(({ userId }) => {
        return this.postsService.fetchPosts(userId);
      }),
      map(res => postsActions.postsLoaded({ posts: res }))
    );
  });

  updateCommentsPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.getPost),
      switchMap(({ postId }) => {
        return this.postsService.getCommentsByPostId(postId);
      }),
      map(res => postsActions.updateCommentsPost({ postComments: res }))
    );
  });

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(postForm => {
        return this.postsService.createPost(postForm);
      }),
      map(() => postsActions.getPosts({}))
    );
  });

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createComment),
      switchMap(commentForm => {
        return this.postsService.createComment(commentForm);
      }),
      map(({ postId }) => postsActions.getPost({ postId }))
    );
  });
}
