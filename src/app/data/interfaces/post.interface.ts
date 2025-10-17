import { Profile } from './profile.interface';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number;
  communityId: number;
}

export interface Post {
  id: number;
  title: string;
  communityId: number;
  content: string;
  author: Profile;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  likesUsers: string[];
  comments: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  author: Profile;
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}
