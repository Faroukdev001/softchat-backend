import { IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class AuthDto {
  @IsString()
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
  