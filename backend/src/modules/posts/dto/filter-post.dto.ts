import { IsOptional, IsString, IsArray, IsNumber, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterPostDto {
  @ApiPropertyOptional({ example: 'motorcycle', description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ 
    example: ['adventure', 'touring'], 
    description: 'Filter by tags',
    type: [String]
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'recent', 
    description: 'Sort by',
    enum: ['recent', 'popular', 'trending'],
    default: 'recent'
  })
  @IsString()
  @IsOptional()
  @IsIn(['recent', 'popular', 'trending'])
  sort?: string = 'recent';

  @ApiPropertyOptional({ example: 'bikelife', description: 'Filter by hashtag' })
  @IsString()
  @IsOptional()
  hashtag?: string;

  @ApiPropertyOptional({ 
    example: 'DESC', 
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC'
  })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
