import { User } from 'src/users/user.entity';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOneBy({ email });
    }

    async findById(id: number): Promise<User | null> {
        return this.findOneBy({ id });
    }

    async createUser(registerDto: RegisterDto, hashedPassword: string): Promise<User> {
        const { username, email } = registerDto;

        const user = this.create({
            username,
            email,
            password: hashedPassword,
            bookMarks: [], // Initialize with empty array
            statusMessage: "", // Initialize with empty string
            softPoints: 0, // Initialize with 0 points
        });

        try {
            await this.save(user);
            return user;
        } catch (error) {
            if (error.code === '23505') { // Duplicate email
                throw new ConflictException('Email already exists');
            }
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async updateRefreshToken(userId: number, hashedRefreshToken: string | undefined): Promise<void> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.refreshToken = hashedRefreshToken;
        await this.save(user);
    }

    async validateUser(loginDto: LoginDto): Promise<User> {
        const { email } = loginDto;
        const user = await this.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createDummyUsers(): Promise<User[]> {
        const dummyUsers: User[] = [];
        
        for (let i = 1; i <= 5; i++) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash('Password123!', salt);
            
            const user = this.create({
                username: `dummy_user_${i}`,
                email: `dummy${i}@example.com`,
                password: hashedPassword,
                bookMarks: [],
                statusMessage: `I am dummy user ${i}`,
                softPoints: i * 100,
            });

            try {
                await this.save(user);
                dummyUsers.push(user);
            } catch (error) {
                if (error.code !== '23505') { // Ignore duplicate email errors
                    throw new InternalServerErrorException('Error creating dummy user');
                }
            }
        }

        return dummyUsers;
    }
}