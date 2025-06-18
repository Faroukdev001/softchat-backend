import { IsNotEmpty } from "class-validator";
import { CommentType } from "../comment-type.enum";
import { UserSimpleInfoDto } from "src/users/dto/user-simple-info.dto";

export class CommentInfoDto {

    id: number;
    
    content: string;
    
    type: CommentType;
    
    parentCommentId: number;
    
    parentCommentAuthor: string;
    
    @IsNotEmpty()
    postId: number;
      
    @IsNotEmpty()
    user: UserSimpleInfoDto;
    
    @IsNotEmpty()
    createdAt: Date;
    
    @IsNotEmpty()
    updatedAt: Date;
    
    childrenCount: number;
    
}

export class CommentInfoListDto {
    comments: CommentInfoDto[];
    total: number;
}