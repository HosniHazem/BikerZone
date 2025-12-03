export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  hashtags?: string[];
  likes?: string[];
  likesCount: number;
  comments?: Comment[];
  commentsCount: number;
  isActive: boolean;
  isLikedByUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  userId: string;
  content: string;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface AddCommentDto {
  content: string;
}

export interface FilterPostDto {
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'trending';
  hashtag?: string;
  order?: 'ASC' | 'DESC';
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface LikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface TrendingHashtag {
  tag: string;
  count: number;
}

export interface UserPostsResponse {
  data: Post[];
  total: number;
}
