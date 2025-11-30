import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Profile picture URL' })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Motorcycle enthusiast', description: 'User bio' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'New York, USA', description: 'User location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
