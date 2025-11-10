import { createFeature, createReducer, on } from '@ngrx/store';
import { PostsState } from '../../posts-api';
import { postsActions } from './actions';

export const initialStatePosts: PostsState = {
  posts: [],
};

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialStatePosts,
    on(postsActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts,
      };
    }),
    on(postsActions.updateCommentsPost, (state, payload) => {
      const postId = payload.postComments[0].postId;

      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: payload.postComments,
              }
            : post
        ),
      };
    })
  ),
});
