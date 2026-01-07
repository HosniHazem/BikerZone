import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 'abc-123-def', description: 'Garage ID' })
  @IsString()
  @IsNotEmpty()
  garageId: string;

  @ApiProperty({ example: 'Oil Change and Tire Check', description: 'Booking title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Need full service', description: 'Booking description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Oil Change', description: 'Service type' })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiPropertyOptional({ example: 'Yamaha MT-07', description: 'Bike model' })
  @IsString()
  @IsOptional()
  bikeModel?: string;

  @ApiPropertyOptional({ example: 'ABC-1234', description: 'Bike plate number' })
  @IsString()
  @IsOptional()
  bikePlate?: string;

  @ApiProperty({ example: '2026-01-15T10:00:00Z', description: 'Start date and time' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-01-15T12:00:00Z', description: 'End date and time' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 50.00, description: 'Estimated price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'Please check brakes carefully', description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ example: 'Oil Change and Brake Service', description: 'Booking title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Booking description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Brake Service', description: 'Service type' })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiPropertyOptional({ example: 'Yamaha MT-09', description: 'Bike model' })
  @IsString()
  @IsOptional()
  bikeModel?: string;

  @ApiPropertyOptional({ example: 'XYZ-5678', description: 'Bike plate number' })
  @IsString()
  @IsOptional()
  bikePlate?: string;

  @ApiPropertyOptional({ example: '2026-01-16T10:00:00Z', description: 'Start date and time' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-01-16T12:00:00Z', description: 'End date and time' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ 
    enum: BookingStatus, 
    example: BookingStatus.CONFIRMED, 
    description: 'Booking status' 
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ example: 75.00, description: 'Price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'Updated notes', description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CancelBookingDto {
  @ApiProperty({ example: 'Schedule conflict', description: 'Reason for cancellation' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class FilterBookingDto {
  @ApiPropertyOptional({ example: 'abc-123', description: 'Filter by garage ID' })
  @IsString()
  @IsOptional()
  garageId?: string;

  @ApiPropertyOptional({ 
    enum: BookingStatus, 
    example: BookingStatus.PENDING, 
    description: 'Filter by status' 
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
