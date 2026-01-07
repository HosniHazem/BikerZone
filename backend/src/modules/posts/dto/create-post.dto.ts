import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My new bike adventure', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Just took my bike on an amazing ride through the mountains! #bikelife', 
    description: 'Post content' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ 
    example: ['adventure', 'mountains'], 
    description: 'Post tags',
    type: [String]
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
