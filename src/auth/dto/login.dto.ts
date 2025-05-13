import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class LoginDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
  }
  