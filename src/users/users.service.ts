import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';


// Database Layer
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });
    }

    // async findAll(): Promise<User[]> {
    //     return this.userRepo.find();
    // }

    async findAllUsersWithPagination(
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: User[]; total: number }> {
        const [data, total] = await this.userRepo.findAndCount({
            where: search ? { email: Like(`%${search}%`) } : {},
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' },
        });

        return { data, total };
    }


    async updateRole(id: number, role: Role): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        user.role = role;
        return this.userRepo.save(user);
    }

    async banUser(id: number, reason: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        user.isBanned = true;
        return this.userRepo.save(user);
    }

    async unbanUser(id: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        user.isBanned = false;
        return this.userRepo.save(user);
    }


    async deleteUser(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }

    async createUser(email: string, password: string): Promise<User> {
        const user = this.userRepo.create({ email, password });
        return this.userRepo.save(user);
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.userRepo.update(userId, { refreshToken });
    }

}
