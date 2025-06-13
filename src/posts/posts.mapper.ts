// src/posts/post.mapper.ts
import { Post } from './posts.entity';
import { PostResponseDto } from './dto/post-info.dto';
import { toUserResponseDto } from 'src/users/user.mapper';
import { Exclude } from 'class-transformer';

export function toPostResponseDto(post: Post): PostResponseDto {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl ?? '',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}
