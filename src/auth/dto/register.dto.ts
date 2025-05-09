import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class RegisterDto {

  @IsString()
  @MinLength(4)
  name: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { 
      message: 'password is too weak' 
  })
  password: string;
  }
  