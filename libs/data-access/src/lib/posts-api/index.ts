import type {
  Post,
  PostComment,
  PostsState,
} from './interfaces/post.interface';
import { PostService } from './services/post.service';

export { PostService };
export type { Post, PostComment, PostsState };
export * from './store';
