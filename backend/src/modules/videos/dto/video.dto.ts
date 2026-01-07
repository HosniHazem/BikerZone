import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BikeCategory, VideoLevel } from '../schemas/video.schema';

export class CreateVideoDto {
  @ApiProperty({ example: 'How to Change Motorcycle Oil', description: 'Video title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Complete guide on changing motorcycle oil for beginners',
    description: 'Video description' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://youtube.com/watch?v=xyz', description: 'Video URL' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', description: 'Thumbnail URL' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ example: 600, description: 'Duration in seconds' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ 
    enum: BikeCategory, 
    example: BikeCategory.SPORT,
    description: 'Bike category' 
  })
  @IsEnum(BikeCategory)
  @IsOptional()
  category?: BikeCategory;

  @ApiPropertyOptional({ 
    enum: VideoLevel, 
    example: VideoLevel.BEGINNER,
    description: 'Difficulty level',
    default: VideoLevel.BEGINNER 
  })
  @IsEnum(VideoLevel)
  @IsOptional()
  level?: VideoLevel;

  @ApiPropertyOptional({ 
    example: ['maintenance', 'oil change', 'tutorial'],
    description: 'Video tags' 
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: false, description: 'Featured video' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}

export class FilterVideoDto {
  @ApiPropertyOptional({ example: 'oil change', description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: BikeCategory, description: 'Filter by category' })
  @IsEnum(BikeCategory)
  @IsOptional()
  category?: BikeCategory;

  @ApiPropertyOptional({ enum: VideoLevel, description: 'Filter by level' })
  @IsEnum(VideoLevel)
  @IsOptional()
  level?: VideoLevel;

  @ApiPropertyOptional({ example: 'maintenance', description: 'Filter by tag' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ example: 'views', enum: ['views', 'likes', 'recent'], description: 'Sort by' })
  @IsString()
  @IsOptional()
  sortBy?: 'views' | 'likes' | 'recent';

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
