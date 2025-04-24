import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { toUserResponseDto } from 'src/users/user.mapper';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,        
    ) {}

    async register(authDto: AuthDto): Promise<{ message: string, user: UserResponseDto }>{
        const { email, password } = authDto;
        
        const userExists = await this.usersService.findByEmail(email);
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.usersService.createUser(email, hashedPassword);

        return { message: 'User registered successfully', user: toUserResponseDto(user) };
    }

    async login(authDto: AuthDto): Promise<{ accessToken: string, user: UserResponseDto }> {
        const { email, password } = authDto;
        const user = await this.usersService.findByEmail(email);

        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        const payload = { sub: user.id }; // You can include email/username if needed
        const accessToken = this.jwtService.sign(payload);
    
        return {
            accessToken,
            user: toUserResponseDto(user),
        };
    }
}
