import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';


// Database Layer
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return this.userRepo.find();
    }      

    async createUser(email: string, password: string): Promise<User> {
        const user = this.userRepo.create({ email, password });
        return this.userRepo.save(user);
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.userRepo.update(userId, { refreshToken });
      }
      
}
