import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AlertType, AlertSeverity } from '../schemas/alert.schema';

export class LocationDto {
  @ApiProperty({ example: 40.7128, description: 'Latitude' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude' })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({ example: '123 Main St, City', description: 'Address' })
  @IsString()
  @IsOptional()
  address?: string;
}

export class CreateAlertDto {
  @ApiProperty({ 
    enum: AlertType, 
    example: AlertType.POLICE,
    description: 'Alert type' 
  })
  @IsEnum(AlertType)
  @IsNotEmpty()
  type: AlertType;

  @ApiProperty({ example: 'Police checkpoint ahead', description: 'Alert title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Police checkpoint on Highway 101',
    description: 'Alert description' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: LocationDto, description: 'Alert location' })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @ApiPropertyOptional({ 
    enum: AlertSeverity, 
    example: AlertSeverity.MEDIUM,
    description: 'Alert severity',
    default: AlertSeverity.MEDIUM 
  })
  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;

  @ApiProperty({ 
    example: '2026-01-07T18:00:00Z',
    description: 'When the alert expires' 
  })
  @IsDateString()
  @IsNotEmpty()
  validUntil: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/image.jpg',
    description: 'Optional image URL' 
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateAlertDto extends PartialType(CreateAlertDto) {}

export class FilterAlertDto {
  @ApiPropertyOptional({ enum: AlertType, description: 'Filter by type' })
  @IsEnum(AlertType)
  @IsOptional()
  type?: AlertType;

  @ApiPropertyOptional({ enum: AlertSeverity, description: 'Filter by severity' })
  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;

  @ApiPropertyOptional({ example: 40.7128, description: 'Latitude for nearby search' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: -74.0060, description: 'Longitude for nearby search' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ example: 10, description: 'Radius in kilometers' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radius?: number;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
