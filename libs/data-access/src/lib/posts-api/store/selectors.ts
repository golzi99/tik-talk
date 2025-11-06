import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';
import { Post } from '@tt/data-access';

export const selectPosts = createSelector(
  postsFeature.selectPosts,
  (posts: Post[]) => posts
);
