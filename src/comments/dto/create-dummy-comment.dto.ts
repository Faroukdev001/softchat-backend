import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDummyCommentsDto {
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsNotEmpty()
    @IsNumber()
    commentCount: number;

    @IsOptional()
    @IsNumber()
    repliesPerComment?: number;
}