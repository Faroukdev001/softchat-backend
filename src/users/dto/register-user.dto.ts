import { IsString } from "class-validator";


export class RegisterDto {
    @IsString({ message: 'Name is required' })
    name: string;
    @IsString({ message: 'Email is required' })
    email: string;
    @IsString({ message: 'Password is required' })
    password: string;
}