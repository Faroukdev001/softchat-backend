// src/posts/dto/create-post.dto.ts
import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 500, { message: 'Post content must be between 1 and 500 characters.' })
  content: string;

  @IsOptional()
  @IsString()
  image?: string; // URL or base64 (depending on your upload strategy)
}
