// src/posts/dto/post-response.dto.ts
import { Exclude } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class PostResponseDto {
  id: number;
  content: string;
  imageUrl: string;
  // @Exclude()
  // author: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
