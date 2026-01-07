import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'abc123-def456-ghi789', 
    description: 'Password reset token received via email' 
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ 
    example: 'NewSecurePass123!', 
    description: 'New password (minimum 6 characters)',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}
