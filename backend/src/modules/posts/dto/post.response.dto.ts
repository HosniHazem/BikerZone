import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationDto {
  @ApiPropertyOptional({ example: 48.8566 })
  lat?: number;

  @ApiPropertyOptional({ example: 2.3522 })
  lng?: number;

  @ApiPropertyOptional({ example: 'Paris, France' })
  address?: string;
}

export class CommentDto {
  @ApiProperty({ example: '65f0c1234abc56789def0123', description: 'Comment author user id' })
  userId!: string;

  @ApiProperty({ example: 'Nice ride!' })
  content!: string;

  @ApiProperty({ example: '2024-05-01T12:00:00.000Z' })
  createdAt!: string | Date;
}

export class PostDto {
  @ApiProperty({ example: '65f0c1234abc56789def0123' })
  id!: string;

  @ApiProperty({ example: '65f0c1234abc56789def0456' })
  userId!: string;

  @ApiPropertyOptional({ example: 'My new bike adventure' })
  title?: string;

  @ApiProperty({ example: 'Just took my bike on an amazing ride through the mountains! #bikelife' })
  content!: string;

  @ApiPropertyOptional({ type: [String], example: ['adventure', 'mountains'] })
  tags?: string[];

  @ApiPropertyOptional({ type: [String], example: ['#bikelife', '#adventure'] })
  hashtags?: string[];

  @ApiPropertyOptional({ type: [String], example: ['https://cdn.example.com/img1.jpg'] })
  images?: string[];

  @ApiPropertyOptional({ type: LocationDto })
  location?: LocationDto;

  @ApiPropertyOptional({ type: [String], example: ['65f0c1234abc56789def0789'] })
  likes?: string[];

  @ApiProperty({ example: 12 })
  likesCount!: number;

  @ApiPropertyOptional({ type: [CommentDto] })
  comments?: CommentDto[];

  @ApiProperty({ example: 2 })
  commentsCount!: number;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiPropertyOptional({ example: false })
  isLikedByUser?: boolean;

  @ApiProperty({ example: '2024-05-01T12:00:00.000Z' })
  createdAt!: string | Date;

  @ApiPropertyOptional({ example: '2024-05-01T12:30:00.000Z' })
  updatedAt?: string | Date;
}

export class PostsPageResponseDto {
  @ApiProperty({ type: [PostDto] })
  data!: PostDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}

export class UserPostsResponseDto {
  @ApiProperty({ type: [PostDto] })
  data!: PostDto[];

  @ApiProperty({ example: 7 })
  total!: number;
}

export class LikeResponseDto {
  @ApiProperty({ example: true })
  isLiked!: boolean;

  @ApiProperty({ example: 13 })
  likesCount!: number;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Post deleted successfully' })
  message!: string;
}

export class TrendingHashtagDto {
  @ApiProperty({ example: '#bikelife' })
  tag!: string;

  @ApiProperty({ example: 25 })
  count!: number;
}
