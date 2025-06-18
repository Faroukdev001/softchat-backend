import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateDummyCommentDto {

    @IsNotEmpty()
    postId: number;

    @IsOptional()
    parentCommentId?: number;
    
    @IsOptional()
    parentCommentAuthor?: string;
    
}