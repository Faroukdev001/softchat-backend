import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { toUserResponseDto } from 'src/users/user.mapper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,        
    ) {}

    async register(registerDto: RegisterDto): Promise<{ message: string, user: UserResponseDto }>{
        const { name, email, password } = registerDto;
        
        const userExists = await this.usersService.findByEmail(email);
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.usersService.createUser(name, email, hashedPassword);

        return { message: 'User registered successfully', user: toUserResponseDto(user) };
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string, user: UserResponseDto }> {
        const { email, password } = loginDto;
        const user = await this.usersService.findByEmail(email);

        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        if (user.isBanned) {
            throw new BadRequestException('Your account has been banned. Contact support.');
        }

        const payload = { sub: user.id }; // You can include email/username if needed
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // Save hashed refresh token
        const hashedRefereshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(user.id.toString(), hashedRefereshToken);
    
        return {
            accessToken,
            refreshToken,
            user: toUserResponseDto(user),
        };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.usersService.findById(Number(userId));
        if (!user || !user.refreshToken) {
          throw new BadRequestException('Access Denied');
        }
    
        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isMatch) {
          throw new BadRequestException('Access Denied');
        }
    
        const payload = { sub: user.id };
        const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
        const newRefreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    
        await this.usersService.updateRefreshToken(user.id.toString(), await bcrypt.hash(newRefreshToken, 10));
    
        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
    }
}
