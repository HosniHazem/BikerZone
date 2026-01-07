import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GarageStatus } from '../entities/garage.entity';

export class FilterGarageDto {
  @ApiPropertyOptional({ example: 'bike repair', description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'oil change', description: 'Filter by service' })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiPropertyOptional({ enum: GarageStatus, example: GarageStatus.ACTIVE, description: 'Filter by status' })
  @IsEnum(GarageStatus)
  @IsOptional()
  status?: GarageStatus;

  @ApiPropertyOptional({ example: 40.7128, description: 'Latitude for location search' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: -74.0060, description: 'Longitude for location search' })
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
