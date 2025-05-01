import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

export function toUserResponseDto(user: User): UserResponseDto {
  const { id, email, softPoints, createdAt, role, isBanned } = user;
  return { id, email, softPoints, createdAt, role, isBanned };
}
