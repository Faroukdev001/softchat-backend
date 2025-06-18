import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CommentType } from "../comment-type.enum";

export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsOptional()
    parentCommentId?: number;
    
    @IsOptional()
    parentCommentAuthor?: string;
    
    
}