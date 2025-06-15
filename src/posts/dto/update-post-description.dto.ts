import { IsNotEmpty } from "class-validator";

export class UpdatePostDescriptionDto {

    @IsNotEmpty()
    postId: number;

    @IsNotEmpty()
    description: string;
}