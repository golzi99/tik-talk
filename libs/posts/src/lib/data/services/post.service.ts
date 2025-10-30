import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';
import { map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  posts = signal<Post[]>([]);

  createPost = (payload: PostCreateDto) => {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  };

  fetchPosts = (userId?: number) => {
    const params = userId ? new HttpParams().set('user_id', userId?.toString()) : undefined;

    return this.#http
      .get<Post[]>(`${this.baseApiUrl}post/`, {
        params,
      })
      .pipe(
        tap(res => {
          this.posts.set(res);
        })
      );
  };

  createComment = (payload: CommentCreateDto) => {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload);
  };

  getCommentsByPostId = (postId: number) => {
    return this.#http.get<Post>(`${this.baseApiUrl}post/${postId}`).pipe(map(res => res.comments));
  };
}
