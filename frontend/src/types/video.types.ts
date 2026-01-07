export enum BikeCategory {
  SPORT = 'sport',
  CRUISER = 'cruiser',
  TOURING = 'touring',
  ADVENTURE = 'adventure',
  STANDARD = 'standard',
  CUSTOM = 'custom',
}

export enum VideoLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: BikeCategory;
  level: VideoLevel;
  tags: string[];
  views: number;
  likes: string[];
  likesCount: number;
  uploadedBy: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVideoDto {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: BikeCategory;
  level?: VideoLevel;
  tags?: string[];
}

export interface UpdateVideoDto {
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  category?: BikeCategory;
  level?: VideoLevel;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface FilterVideoDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: BikeCategory;
  level?: VideoLevel;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  sort?: 'recent' | 'popular' | 'views' | 'likes';
  order?: 'ASC' | 'DESC';
}

export interface VideosResponse {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VideoViewDto {
  videoId: string;
  userId: string;
  watchDuration?: number;
}

export interface LikeVideoDto {
  videoId: string;
}