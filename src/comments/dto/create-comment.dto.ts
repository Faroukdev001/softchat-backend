import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNumber()
  postId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
