import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    
    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('/create-dummy-users')
    async createDummyUsers(): Promise<{ message: string, users: User[] }> {
        const users = await this.authService.createDummyUsers();
        return {
            message: 'Successfully created 5 dummy users',
            users
        };
    }

    @Post('/refresh')
    async refresh(@Body() body: { userId: string; refreshToken: string }) {
      return this.authService.refreshTokens(body.userId, body.refreshToken);
    }

}
