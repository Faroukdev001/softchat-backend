import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { toUserResponseDto } from './user.mapper';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('/me')
    getMe(@GetUser() user: User): UserResponseDto {
        return toUserResponseDto(user);
    }

    @Get(':id')
    async getUserProfile(@Param('id') id: number): Promise<UserResponseDto> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return toUserResponseDto(user);
    }
}
