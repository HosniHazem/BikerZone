import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address to send reset link' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
