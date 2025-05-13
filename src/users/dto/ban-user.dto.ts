import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class BanUserDto {
  @IsBoolean()
  isBanned: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
