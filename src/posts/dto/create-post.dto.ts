// src/posts/dto/create-post.dto.ts
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {

  @IsNotEmpty()
  description: string;
}
