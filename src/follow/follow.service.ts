import { Injectable, Logger } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SingleIntegerDto } from './dto/single-integer.dto';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';
import { UserListDto } from 'src/users/dto/user-list.dto';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(FollowRepository)
        private followRepository: FollowRepository,
    ) {}

    private logger = new Logger('FollowService');

    async createFollow(follower: User, following: string): Promise<SingleIntegerDto> {
        const user = await this.userRepository.findOne({ where: { email: following } });
        if (!user) {
            throw new Error(`User with email ${following} not found`);
        }
        await this.followRepository.createFollow(follower, user);

        let singleIntegerDto: SingleIntegerDto = new SingleIntegerDto();
        singleIntegerDto.value = await this.followRepository.getFollowerCount(following);
        return singleIntegerDto;
    }

    async getIsFollowing(myEmail: string, userEmail: string): Promise<boolean> {
        return this.followRepository.getIsFollowing(myEmail, userEmail);
    }

    async getFollowerCount(email: string): Promise<number> {
        return await this.followRepository.getFollowerCount(email);
    }

    async getFollowingCount(email: string): Promise<number> {
        return await this.followRepository.getFollowingCount(email);
    }

    async cancelFollowing(myEmail: string, email: string): Promise<SingleIntegerDto> {
        await this.followRepository.cancelFollowing(myEmail, email);

        let singleIntegerDto: SingleIntegerDto = new SingleIntegerDto();
        singleIntegerDto.value = await this.followRepository.getFollowerCount(email);
        return singleIntegerDto;
    }

    async getFollowerList(email: string, page: number, limit: number): Promise<UserListDto> {
        return await this.followRepository.getFollowerList(email, page, limit);
    }

    async getFollowingList(email: string, page: number, limit: number): Promise<UserListDto> {
        return await this.followRepository.getFollowingList(email, page, limit);
    }

}
