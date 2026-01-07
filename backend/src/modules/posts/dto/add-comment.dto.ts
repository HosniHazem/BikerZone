import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({ example: 'Great post! Love the pics.', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
