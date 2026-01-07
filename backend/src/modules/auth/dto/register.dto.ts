import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BikeType } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    enum: BikeType, 
    example: BikeType.SPORT,
    description: 'Type of motorcycle',
    default: BikeType.STANDARD
  })
  @IsEnum(BikeType, { message: 'Invalid bike type' })
  @IsOptional()
  bikeType?: BikeType;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!', 
    description: 'Password (minimum 6 characters)',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}
