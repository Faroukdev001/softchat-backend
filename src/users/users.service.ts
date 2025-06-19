import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { BanUserDto } from './dto/ban-user.dto';
import { UserRepository } from './user.repository';
import { UserInfoDto } from './dto/user-info.dto';
import { UserInfoIncludingIsFollowingDto } from './dto/user-info-including-isfollowing.dto';
import { UpdatedUserThumbnailDto } from './dto/updated-user-thumbnail.dto';
import { UserListDto } from './dto/user-list.dto';
import { PostRepository } from 'src/posts/posts.repository';
import { FollowRepository } from 'src/follow/follow.repository';


// Database Layer
@Injectable()
export class UsersService {
    constructor(
        private userRepo: UserRepository,
        private postsRepository: PostRepository, // Assuming you have a PostsRepository for post-related operations
        private followRepository: FollowRepository,
    ) {}

    async getUserInfo(email: string): Promise<UserInfoDto> {
        const userInfo = await this.userRepo.getUserInfo(email);
        return userInfo;
    }

    async getUserInfoByEmail(myEmail: string, userEmail: string): Promise<UserInfoIncludingIsFollowingDto> {
        const userInfoIncludingIsFollowing = new UserInfoIncludingIsFollowingDto();

        const userInfo = await this.userRepo.getUserInfo(userEmail);
        userInfoIncludingIsFollowing.email = userInfo.email
        userInfoIncludingIsFollowing.username = userInfo.username
        userInfoIncludingIsFollowing.thumbnail = userInfo.thumbnail
        userInfoIncludingIsFollowing.bookMarks = userInfo.bookMarks
        userInfoIncludingIsFollowing.statusMessage = userInfo.statusMessage
        userInfoIncludingIsFollowing.totalPostCount = userInfo.totalPostCount
        userInfoIncludingIsFollowing.followerCount = userInfo.followerCount
        userInfoIncludingIsFollowing.followingCount = userInfo.followingCount

        const isFollowing = await this.followRepository.getIsFollowing(myEmail, userEmail);
        userInfoIncludingIsFollowing.isFollowing = isFollowing;

        return userInfoIncludingIsFollowing;
    }

    async postBookMark(email: string, postId: number): Promise<void> {
    const bookMarks = await this.userRepo.postBookMark(email, postId);
    if (bookMarks) {
        await this.postsRepository.postBookMark(email, postId);
        }
    }

    async updateUserThumbnail(email: string, newThumbnailUrl: string): Promise<UpdatedUserThumbnailDto> {
        return await this.userRepo.updateUserThumbnail(email, newThumbnailUrl);
    }

    async deleteThumbnail(user: User): Promise<UpdatedUserThumbnailDto> {
        return await this.userRepo.deleteThumbnail(user);
    }

    async updateStatusMessage(email: string, newStatusMessage: string): Promise<void> {
        return await this.userRepo.updateStatusMessage(email, newStatusMessage);
    }
    
    async getUserListByKeyword(user: User, keyword: string, page: number, limit: number): Promise<UserListDto> {
        return await this.userRepo.getUserListByKeyword(user, keyword, page, limit);
    }

    async createUser(username: string, email: string, password: string): Promise<User> {
        const user = this.userRepo.create({ username, email, password });
        return this.userRepo.save(user);
    }

    // async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    //     await this.userRepo.update(userId, { refreshToken });
    // }

}




























    // async findByEmail(email: string): Promise<User | null> {
    //     return this.userRepo.findOne({ where: { email } });
    // }

    // async findById(id: number): Promise<User | null> {
    //     return this.userRepo.findOne({ where: { id } });
    // }

    // // async findAll(): Promise<User[]> {
    // //     return this.userRepo.find();
    // // }

    // async findAllUsersWithPagination(
    //     page: number,
    //     limit: number,
    //     search?: string
    // ): Promise<{ data: User[]; total: number }> {
    //     const [data, total] = await this.userRepo.findAndCount({
    //         where: search ? { email: Like(`%${search}%`) } : {},
    //         take: limit,
    //         skip: (page - 1) * limit,
    //         order: { createdAt: 'DESC' },
    //     });
    //     return { data, total };
    // }


    // async updateRole(id: number, role: Role): Promise<User> {
        //     const user = await this.userRepo.findOne({ where: { id } });
        //     if (!user) throw new NotFoundException('User not found');
        //     user.role = role;
        //     return this.userRepo.save(user);
        // }
    
        // async banUser(id: number, dto: BanUserDto): Promise<User> {
        //     const user = await this.userRepo.findOne({ where: { id } });
        //     if (!user) throw new NotFoundException('User not found');
    
        //     user.isBanned = dto.isBanned;
        //     user.reason = dto.reason || null;
        //     user.bannedAt = dto.isBanned ? new Date() : null;
        //     return this.userRepo.save(user);
        // }
    
        // async unbanUser(id: number): Promise<User> {
        //     const user = await this.userRepo.findOne({ where: { id } });
        //     if (!user) throw new NotFoundException('User not found');
        //     user.isBanned = false;
        //     user.reason = null;
        //     user.bannedAt = null;
        //     return this.userRepo.save(user);
        // }
    
        // async deleteUser(id: string): Promise<void> {
        //     await this.userRepo.delete(id);
        // }
    
