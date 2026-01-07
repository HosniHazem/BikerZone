import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Excellent Service!', description: 'Review title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Very professional and quick service', description: 'Review content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ 
    example: ['image1.jpg', 'image2.jpg'], 
    description: 'Review images' 
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 'Updated Review Title', description: 'Review title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated review content', description: 'Review content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 4, description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ 
    example: ['image1.jpg'], 
    description: 'Review images' 
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class RespondToReviewDto {
  @ApiProperty({ example: 'Thank you for your feedback!', description: 'Owner response' })
  @IsString()
  @IsNotEmpty()
  response: string;
}
