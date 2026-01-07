import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GarageStatus } from '../entities/garage.entity';

export class CreateGarageDto {
  @ApiProperty({ example: 'Premium Bike Garage', description: 'Garage name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Expert motorcycle repair and maintenance', description: 'Garage description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '123 Main St, City', description: 'Garage address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 40.7128, description: 'Latitude' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.0060, description: 'Longitude' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'garage@example.com', description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://garage.com', description: 'Website URL' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: ['image1.jpg', 'image2.jpg'], description: 'Garage images' })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ 
    example: ['oil change', 'tire replacement', 'brake service'], 
    description: 'Services offered' 
  })
  @IsArray()
  @IsOptional()
  services?: string[];

  @ApiPropertyOptional({ example: '08:00', description: 'Opening time (HH:mm)' })
  @IsString()
  @IsOptional()
  openingTime?: string;

  @ApiPropertyOptional({ example: '18:00', description: 'Closing time (HH:mm)' })
  @IsString()
  @IsOptional()
  closingTime?: string;

  @ApiPropertyOptional({ 
    example: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
    description: 'Working days' 
  })
  @IsArray()
  @IsOptional()
  workingDays?: string[];

  @ApiPropertyOptional({ 
    enum: GarageStatus, 
    example: GarageStatus.ACTIVE, 
    description: 'Garage status' 
  })
  @IsEnum(GarageStatus)
  @IsOptional()
  status?: GarageStatus;

  @ApiPropertyOptional({ example: true, description: 'Is garage verified' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
