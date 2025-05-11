// src/posts/dto/post-response.dto.ts
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class PostResponseDto {
  id: number;
  content: string;
  imageUrl: string;
  author: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
