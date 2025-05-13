import { Exclude } from "class-transformer";

export class UserResponseDto {
    id: number;
    email: string;
    softPoints: number;
    createdAt: Date;
    @Exclude()
    role?: string;
    @Exclude()
    isBanned?: boolean;
  }
  