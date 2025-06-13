// src/posts/dto/post-response.dto.ts
import { Exclude } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UserSimpleInfoDto } from 'src/users/dto/user-simple-info.dto';

export class PostInfoDto {
  id: number;
  description: string;
  // status: PostStatus;
  imageUrl: string[];
  createdAt: Date;
  updatedAt: Date;
  user: UserSimpleInfoDto;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  commentCount: number;
}

export class PostResponse {

    posts: PostInfoDto[];
    total: number;
}